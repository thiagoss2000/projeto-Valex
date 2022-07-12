export function cardUserName(userName: string) {
    const usernameArr = userName.split(' ');
    const linkName = /^de|do|da|dos|das|De|Do|Da|Dos|Das$/;
    let usernameCard = [];
    usernameArr.forEach((e, i) => {
        if(i == 0 || i == usernameArr.length -1) {
            usernameCard.push(e);
        } else if (!linkName.test(e)){
            usernameCard.push(e[0]);
        }
    })
    return usernameArr.join(' ').toUpperCase();
}

export function dateExpiration(validTime: number) {
    const mouth = new Date().getMonth().toString().padStart(2, '0');
    const year = (new Date().getFullYear() + validTime).toString().slice(2, 4);
    return mouth+'/'+year;
}