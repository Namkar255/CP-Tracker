async function updateProfileButton(){

    try{

        const response =
            await fetch(
                "/api/auth-status"
            );

        const data =
            await response.json();

        const button =
            document.getElementById(
                "login"
            );

        if(
            data.loggedIn &&
            button
        ){

            button.textContent =
                "Profile";

            button.href =
                "/profile";

        }

    }
    catch(error){

        console.log(error);

    }

}

updateProfileButton();