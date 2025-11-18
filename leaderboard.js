/* ========== Leaderboard System ========== */

/* ======= User Class ======= */
class User {
    constructor(name){
        this.name = name;
        this.xp = 0;
        this.coins = 0;
        this.level = 1;
    }

    gainXP(amount){
        this.xp += amount;
        if(this.xp >= this.level * 100){
            this.level++;
            alert(`${this.name} leveled up to ${this.level}!`);
        }
        this.save();
    }

    gainCoins(amount){
        this.coins += amount;
        this.save();
    }

    save(){
        let allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const index = allUsers.findIndex(u => u.name === this.name);
        if(index >= 0){
            allUsers[index] = this;
        } else {
            allUsers.push(this);
        }
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
}

/* ======= Leaderboard Functions ======= */
function loadLeaderboard(){
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Sort users by XP descending
    allUsers.sort((a,b)=> b.xp - a.xp);

    allUsers.forEach((u, index)=>{
        const li = document.createElement('li');
        li.innerText = `${index+1}. ${u.name} - XP: ${u.xp} | Coins: ${u.coins} | Level: ${u.level}`;
        leaderboardList.appendChild(li);
    });
}

/* ======= Add User ======= */
function addUser(name){
    const user = new User(name);
    users.push(user);
    user.save();
    loadLeaderboard();
    return user;
}

/* ======= Example Usage ======= */
// Add current user (could ask for name on first visit)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
if(!currentUser){
    const name = prompt("Enter your username for StudyMaster:");
    currentUser = addUser(name);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

/* ======= Update Leaderboard Whenever Needed ======= */
loadLeaderboard();

/* ======= Update current user XP/Coins from main script ======= */
function updateCurrentUser(xpGain, coinsGain){
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const index = allUsers.findIndex(u => u.name === currentUser.name);
    if(index >= 0){
        allUsers[index].xp += xpGain;
        allUsers[index].coins += coinsGain;
        // Update level
        let lvl = allUsers[index].level;
        if(allUsers[index].xp >= lvl*100){
            allUsers[index].level++;
            alert(`Congrats ${allUsers[index].name}! You reached level ${allUsers[index].level}!`);
        }
        currentUser = allUsers[index];
        localStorage.setItem('users', JSON.stringify(allUsers));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadLeaderboard();
    }
}
