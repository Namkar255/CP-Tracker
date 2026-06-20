const platforms = [
    {
        name: "Codeforces",
        description: "Competitive Programming contests and practice.",
        link: "https://codeforces.com"
    },
    {
        name: "LeetCode",
        description: "Practice coding interviews and DSA problems.",
        link: "https://leetcode.com"
    },
    {
        name: "AtCoder",
        description: "Algorithmic contests and problem solving.",
        link: "https://atcoder.jp"
    },
    {
        name: "CodeChef",
        description: "Monthly contests and programming challenges.",
        link: "https://codechef.com"
    }
];
const platformName = document.getElementById("platform-name");
const platformDescription = document.getElementById("platform-description");
const platformLink = document.getElementById("platform-link");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
let currentIndex = 0;
function updatePlatform() {
    platformName.textContent =
        platforms[currentIndex].name;
    platformDescription.textContent =
        platforms[currentIndex].description;
    platformLink.href =
        platforms[currentIndex].link;
}
nextBtn.addEventListener("click", function() {
    currentIndex++;
    if(currentIndex >= platforms.length){
        currentIndex = 0;
    }
    updatePlatform();
});
prevBtn.addEventListener("click", function() {
    currentIndex--;
    if(currentIndex < 0){
        currentIndex = platforms.length - 1;
    }
    updatePlatform();
});