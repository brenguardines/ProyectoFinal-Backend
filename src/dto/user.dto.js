class UserDTO {
    constructor({firstName, lastName, role}){
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.fullname = `${firstName} ${lastName}` 
    }

}

module.exports = UserDTO;