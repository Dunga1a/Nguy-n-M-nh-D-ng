
const menuHeader = document.querySelector('.js-header__body-menu-icon')

const modal = document.querySelector('.js-overlay')

const closeIcon = document.querySelector('.js-close-icon')

function openModal(){
    modal.classList.add('overlay-open');
}

function closeModal(){
    modal.classList.remove('overlay-open');
}

menuHeader.addEventListener('click', openModal)
closeIcon.addEventListener('click', closeModal)
