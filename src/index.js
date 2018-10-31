
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const style = document.getElementById('style')
const body = document.getElementsByTagName('body')
const container = document.getElementById('container')
const notes = document.getElementById('words')
const start = document.getElementById('start-button')
const key1 = 'water'
const key2 = 'earth'
const key3 = 'fire'
const key4 = 'air'
recognition.interimResults = true;

start.addEventListener('click', e =>{
  recognition.addEventListener('result', e =>{

    const transcript = Array.from(e.results)
    .filter(result => result.isFinal === true)
    .map(result => result[0])
    .map(result => result.transcript)
    .join(" ").toLowerCase()

    if(e.results[0].isFinal){
      let p = document.createElement('p');
      p.className = 'each-note';
      p.innerText = transcript;
      notes.append(p);
    }
    takeNote(transcript);
    saveNote(transcript);
    getNotes(transcript);

    if (transcript.includes('get the weather')){
      fetch('http://api.openweathermap.org/data/2.5/weather?id=5128581&APPID=9a1972fde4fc073ef8f36f03fd7eddeb')
      .then(res => res.json())
      .then(res => displayWeather(res))
    }
  })
})


const displayWeather = (res) =>{
  container.innerHTML = ''
  let kelvin = res.main.temp;
  let far = ((kelvin-273.15)*1.8)+32;
  let actualTempF = Math.round(far)
  container.innerHTML += `<div class="ui card">
                            <div class="content">
                              <div class="header">Weather</div>
                              <div class="description">
                                <p>It is ${actualTempF} degrees in ${res.name}.</p>
                                  </div>
                                </div>`
}



const takeNote = (transcript) =>{
  if(transcript.includes('take notes')){
    container.innerHTML = ''
    $(words).show();
    words.innerHTML = ''
    let p = document.createElement('p');
    p.className = 'each-note'
    notes.append(p)
  }
}

const saveNote = (transcript) =>{
  const realNotes = [];
  const allNotes = document.getElementsByClassName('each-note')
  const notesArray = Array.from(allNotes)


  if(transcript.includes('save my notes')){
  notesArray.map(note =>{
    realNotes.push(note.innerHTML)
  })
  realNotes.pop()
    fetch("http://localhost:4000/notes",
    {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({"content": realNotes.join(",")})
})
  words.innerHTML = ''
  }
}

const getNotes =  (transcript)=>{
if(transcript.includes('get my notes')){
  $(words).css("display", "none")
  fetch("http://localhost:4000/notes")
  .then(res => res.json())
  .then(allNotes => noteGetter(allNotes))
  }
}

const noteGetter = (allNotes) =>{
  allNotes.forEach(note =>{
    container.innerHTML += `<p>${note.content}</p>`
  })
}

recognition.addEventListener('end', recognition.start)

recognition.start();
