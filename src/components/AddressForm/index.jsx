import React, { useState } from "react";
import { TextField, Grid, InputAdornment } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import "./styles.css";

export default function AddressForm() {
  const [fields, setFields] = useState({
    fullAddress: "",
    address: "",
    cep: "",
    neighborhood: "",
    city: "",
    country: "",
  });
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [cepValid, setCepValid] = useState(false);
  const validateCep = async (cep) => {
    if (cep?.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setCepValid(true);
          return true;
        }
      } catch (error) {
        console.error("Erro ao validar CEP:", error);
      }
    }
    setCepValid(false);
    return false;
  };

  const handlePlaceSelect = async (autocomplete) => {
    const place = autocomplete.getPlace();
    const fullAddress = place.formatted_address; // The full address from Google Places
    const components = place.address_components;

    const cep =
      components.find((component) => component.types.includes("postal_code"))
        ?.long_name || "";
    const street =
      components.find((component) => component.types.includes("route"))
        ?.long_name || ""; // Extracts street name
    const neighborhood =
      components.find((component) =>
        component.types.includes("sublocality_level_1")
      )?.long_name || "";
    const city =
      components.find((component) =>
        component.types.includes("administrative_area_level_2")
      )?.long_name || "";
    const country =
      components.find((component) => component.types.includes("country"))
        ?.long_name || "";

    await validateCep(cep.replace(/\D/g, "")); // Remove non-numeric characters before validation

    setFields({
      fullAddress,
      address: street, // Only the street name is stored in the address field
      cep,
      neighborhood,
      city,
      country,
    });
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCaY_sFfo3DKewKbbSnYbNClmv4Q0DRqUg"
      libraries={["places"]}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            onLoad={(autocomplete) => {
              setTimeout(() => {
                autocomplete.setFields([
                  "address_components",
                  "formatted_address",
                  "geometry",
                ]);
                autocomplete.addListener("place_changed", () =>
                  handlePlaceSelect(autocomplete)
                );
                // Ajustar o estilo do container do Autocomplete
                if (document.querySelector(".pac-container")) {
                  document.querySelector(".pac-container").style.zIndex =
                    "2000";
                }
              }, 100); // Delay pode ser ajustado conforme necessário
            }}
          >
            <TextField
              label="Buscar Endereço"
              value={fields.fullAddress}
              onChange={(e) =>
                setFields({ ...fields, fullAddress: e.target.value })
              }
              fullWidth
              variant="outlined"
            />
          </Autocomplete>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="CEP"
            value={fields.cep}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: cepValid ? (
                <InputAdornment position="end">
                  <CheckIcon color="success" />
                </InputAdornment>
              ) : null,
            }}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Endereço"
            value={fields.address}
            fullWidth
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Numero"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Complemento"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Bairro"
            value={fields.neighborhood}
            fullWidth
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cidade"
            value={fields.city}
            fullWidth
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="País"
            value={fields.country}
            fullWidth
            variant="outlined"
            disabled
          />
        </Grid>
      </Grid>
    </LoadScript>
  );
}
