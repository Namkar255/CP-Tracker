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

    }
    catch(error){

        console.log(error);

    }

}

loadProfile();