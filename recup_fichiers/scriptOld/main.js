let openModal = (e)=>{
    document.querySelector('#pModal').innerText = e.getAttribute("data-sentence")
    document.querySelector('#linkModal').href= e.getAttribute("data-route")
}