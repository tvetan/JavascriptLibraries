/// <reference path="../../libs/_references.js" />

window.persisters = (function () {
    var username = localStorage.getItem("username");
    var accessToken = localStorage.getItem("accessToken");
    
    function saveUserData(userData) {
        localStorage.setItem("username", userData.username);
        localStorage.setItem("accessToken", userData.accessToken);
        //  localStorage.setItem("amount", userData.amount);
        username = userData.username;
        accessToken = userData.accessToken;
        // amount = userData.amount;
    }

    function clearUserData() {
        localStorage.removeItem("username");
        localStorage.removeItem("accessToken");
        // localStorage.removeItem("amount");
        username = null;
        accessToken = null;
        amount = null;
    }

    var AuthPersister = Class.create({
        init: function (apiUrl) {
            this.apiUrl = apiUrl;
        },
        login: function (username, password, email) {
            var user = {
                username: username,
                email : email,
                authCode: CryptoJS.SHA1(password).toString()
            };

            return httpRequester.postJSON(this.apiUrl + "token", user)
            .then(function (data) {
                saveUserData(data);
                return data;
            });
        },
    })

    var UsersPersister = Class.create({
        init: function (apiUrl) {
            this.apiUrl = apiUrl;
        },

        register: function (username, password, email) {
            var user = {
                username: username,
                authCode: CryptoJS.SHA1(password).toString(),
                email: email
            };

            return httpRequester.postJSON(this.apiUrl + "register", user)
            .then(function (data) {
                //saveUserData(data);
                return data.username;
            });
        },

        logout: function () {
            var headers;
            if (!accessToken) {
                alert("You are not logged in!");
            }
            else {
                headers = {
                    "X-accessToken": accessToken
                };
                return httpRequester.putJSON(this.apiUrl + "logout", "", headers)
                .then(function (response) {
                    clearUserData();
                    return response;
                });
            }
        }
    });

    var AppointmentsPersister = Class.create({
        init: function (apiUrl) {
            this.apiUrl = apiUrl;
        },

        create: function (subject, description, appointmentDate, duration) {
            headers = {
                "X-accessToken": accessToken
            };

            var appointment = {
                subject: subject,
                description: description,
                
                appointmentDate: appointmentDate,

                duration: parseInt( duration)
            }
            console.log(appointment)

            return httpRequester.postJSON(this.apiUrl,appointment, headers)
            .then(function (data) {
                return data;
            });
        },

        all: function () {
            headers = {
                "X-accessToken": accessToken
            };

            return httpRequester.getJSON(this.apiUrl + "all", headers)
            .then(function (data) {
                return data;
            });
        },

        allUpcomming: function () {
            headers = {
                "X-accessToken": accessToken
            };

            return httpRequester.getJSON(this.apiUrl + "comming", headers)
            .then(function (data) {
                return data;
            });
        },

        byDate : function (date) {
            headers = {
                "X-accessToken": accessToken
            };

            return httpRequester.getJSON(this.apiUrl + "?date=" + date, headers)
            .then(function (data) {
                return data;
            });
        },

        today: function () {
            headers = {
                "X-accessToken": accessToken
            };

            return httpRequester.getJSON(this.apiUrl + "today", headers)
            .then(function (data) {
                return data;
            });
        },

        current: function () {
            headers = {
                "X-accessToken": accessToken
            };

            return httpRequester.getJSON(this.apiUrl + "current", headers)
            .then(function (data) {
                return data;
            });
        }

    })

    var ListPersister = Class.create({
        init: function (apiUrl) {
            this.apiUrl = apiUrl;
        },

        create: function (title, todos) {
            //todo
            headers = {
                "X-accessToken": accessToken
            };
            if (!todos) {
                todos = [];
            }

            var assignment = {
                title: title,
                todos : todos
            }

            return httpRequester.postJSON(this.apiUrl, assignment, headers)
            .then(function (data) {
                return data;
            });
        },

        all: function () {
            headers = {
                "X-accessToken": accessToken
            };
            return httpRequester.getJSON(this.apiUrl + "all", headers)
            .then(function (data) {
                return data;
            });
        },

        single: function (id) {
            headers = {
                "X-accessToken": accessToken
            };
            return httpRequester.getJSON(this.apiUrl + id + "/todos", headers)
            .then(function (data) {
                return data;
            });
        },

        addTodo: function (listId, text) {
            headers = {
                "X-accessToken": accessToken
            };

            var todo = {
                text: text,
            }

            return httpRequester.postJSON(this.apiUrl + listId + "/todos", todo, headers)
            .then(function (data) {
                return data;
            });
        }


    })

    var TodosPersister = Class.create({
        init: function (apiUrl) {
            this.apiUrl = apiUrl;
        },

        changeStatus: function (id) {
            headers = {
                "X-accessToken": accessToken
            };
            return httpRequester.putJSON(this.apiUrl + id, "", headers)
            .then(function (data) {
                return data;
            });
        }

    })

    var CarsPersister = Class.create({
        init: function (apiUrl) {
            this.apiUrl = apiUrl;
        },

        all: function () {
            return httpRequester.getJSON(this.apiUrl + "GetAllFree");
        },

        getById: function (id) {
            return httpRequester.getJSON(this.apiUrl + "GetById/" + id);
        },

        rent: function (carData) {
            headers = {
                "X-sessionKey": accessToken
            };
            return httpRequester.putJSON(this.apiUrl + "rent", carData, headers)
        }
    });

    var StoresPersister = Class.create({
        init: function (apiUrl) {
            this.apiUrl = apiUrl;
        },

        all: function () {
            return httpRequester.getJSON(this.apiUrl);
        },

        getById: function (id) {
            return httpRequester.getJSON(this.apiUrl + id);
        }
    });

    var MainPersister = Class.create({
        init: function (apiUrl) {
            this.users = new UsersPersister(apiUrl + "users/");
            this.auth = new AuthPersister(apiUrl + "auth/");
            this.appointments = new AppointmentsPersister(apiUrl + "appointments/");
            this.lists = new ListPersister(apiUrl + "lists/");
            this.todos = new TodosPersister(apiUrl + "todos/");
            //this.cars = new CarsPersister(apiUrl + "cars/");
            //this.stores = new StoresPersister(apiUrl + "stores/");
        },

        isUserLoggedIn: function () {
            var isLoggedIn = username != null && accessToken != null;
            return isLoggedIn;
        },

        getUsername: function () {
            return username;
        }
    });

    return {
        getPersister: function (apiUrl) {
            return new MainPersister(apiUrl);
        }
    };
}());