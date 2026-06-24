async function loadProfile(){

    try{

        const response =
            await fetch(
                "/api/profile"
            );

        const data =
            await response.json();

        document.getElementById(
            "profile-name"
        ).textContent =
            data.name;

        document.getElementById(
            "profile-email"
        ).textContent =
            data.email;

        document.getElementById(
            "profile-cf"
        ).textContent =
            data.cf_handle ?? "--";

        document.getElementById(
            "profile-lc"
        ).textContent =
            data.leetcode_handle ?? "--";

        document.getElementById(
            "profile-completed"
        ).textContent =
            data.completedGoals;

        document.getElementById(
            "profile-active"
        ).textContent =
            data.activeGoals;

        document.getElementById(
            "profile-contests"
        ).textContent =
            data.savedContests;
        document.getElementById(
            "edit-name"
        ).value =
            data.name;

        document.getElementById(
            "edit-email"
        ).value =
            data.email;

    }
    catch(error){

        console.log(error);

    }

}
const updateButton =
    document.getElementById(
        "update-profile"
    );

updateButton.addEventListener(
    "click",
    async function(){

        const name =
            document
            .getElementById(
                "edit-name"
            )
            .value
            .trim();

        const email =
            document
            .getElementById(
                "edit-email"
            )
            .value
            .trim();

        const response =
            await fetch(
                "/api/profile",
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":
                        "application/json"
                    },
                    body:JSON.stringify({
                        name,
                        email
                    })
                }
            );

        const message =
            document.getElementById(
                "profile-message"
            );

        if(response.ok){

            message.textContent =
                "✓ Profile Updated";

        }
        else{

            message.textContent =
                "Failed To Update";

        }

    }
);
loadProfile();