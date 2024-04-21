 function loadScript(url, callback) {
    const existingScript = document.getElementById(url);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = url;
      script.id = url;
      document.body.appendChild(script);
      script.onload = () => {
        if (callback) callback();
      };
    } else if (callback) {
      callback();
    }
  } 
  
  export default loadScript