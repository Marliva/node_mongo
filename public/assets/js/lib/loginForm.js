const initLoginForm = () => {

    document.forms.login.addEventListener('submit', (event) => {

        event.preventDefault();
        if (document.forms.login.name.value) {

            console.dir(document.forms.login.name.value);
            document.forms.login.submit()
            setTimeout(() => {
                window.location = '/ceppouic?name=' + document.forms.login.name.value;
                
            }, 1000)


        } else {
            console.log('Veuillez renseigner un pseudo');
        }

    })


}

export { initLoginForm }