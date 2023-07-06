function updateSliderValue(value) {
    document.getElementById('sliderValue').innerHTML = value + ' ms';
  }
  function updateProbValue(value) {
    document.getElementById('probValue').innerHTML = value + ' %';
  }
  
  function handleSubmit() {
    let ips = [];
    let ipInputs = document.getElementsByClassName('ip');
    let stateInputs = document.getElementsByClassName('state');
    
    for(let i = 0; i < ipInputs.length; i++) {
      ips.push({
        adr: ipInputs[i].value,
        state: stateInputs[i].checked
      });
    }
    
    let sayings = document.getElementById('thingsToSay').value.split(',').map(saying => saying.trim());
    
    let ms = document.getElementById('responseFastness').value;
    let probability = document.getElementById('probability').value;

    let data = {
      ips: ips,
      sayings: sayings,
      ms: ms,
      probability: probability
    };
    
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }
  