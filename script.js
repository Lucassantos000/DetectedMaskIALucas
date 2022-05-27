const video = document.getElementById("video");
const fundo = document.getElementById("wraping");
    const alerta = document.getElementById("alerta");
    const btnReload = document.getElementById("reloadPage");
// console.log(video);

const loadCan = document.getElementById("loadCan");
const loadData = document.getElementById("loadData");

if(navigator.mediaDevices.getUserMedia){
    loadCan.style.display = 'flex';
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream =>{
        video.style.display = 'block'; 
        video.srcObject = stream;
        loadCan.style.display = 'none';
        loadData.style.cssText = 'display: flex; text-align: center;';
    })
}  


async function retiraLoad(){
    loadData.style.display = 'none';
    loadCan.style.display = 'none';
}

let imageModeURL = "https://teachablemachine.withgoogle.com/models/o66hm6jOl/";

try {

    ml5.imageClassifier(imageModeURL + "model.json")
    .then( classifier =>{
        retiraLoad();
        iniciar(classifier);
        
    });

} catch (error) {
   
    btnReload.style.display = "block";
    alerta.style.display = ' flex ';
    fundo.style.cssText = 'background-color: rgba(255,105,97,1);';
    alerta.innerHTML = "<p>SEM INTENERT </p>" ;
    retiraLoad(); 
     
}

    

function iniciar(classifier){
    setInterval(async ()=>{
        classicarVideo(classifier);    
    },500);
}    

function classicarVideo(classifier){
    let snapshot = ml5.flipImage(video);
    classifier.classify(snapshot, tratarResultado);
}

function tratarResultado(error, resultado){

    
    if(error){
        retiraLoad();
        btnReload.style.display = 'block'; 
        alerta.style.display = ' flex ';
        fundo.style.cssText = 'background-color: rgba(255,105,97,1);';
        alerta.innerHTML = "<p>ERRO AO  NA LEITURA!</p>" ;
        console.log(error);
        return
    }
    
    if(resultado[0].label ==="Mascara"){
        fundo.style.cssText = 'background-color: rgba(189, 236, 182, 1);';
        alerta.innerHTML = "<p>Parabéns você está de Máscara</p>";
    }else if(resultado[0].label ==="NoMascara"){
        fundo.style.cssText = 'background-color: rgba(255,105,97,1);';
        alerta.innerHTML = "<p>Por favor, Coloque a Máscara</p>" + '<img src="./image/mask.png" alt="máscaraCirúrgica" title="máscara" style="width: 50px">';
        // console.log(resultado[0].label)
    }    
        
    
}

btnReload.addEventListener("click", (e)=>{
    location.reload();
})

