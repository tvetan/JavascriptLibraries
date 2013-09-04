/// <reference path="dataPersister.js" />
/// <reference path="../../libs/_references.js" />

window.viewModelsFactory = (function () {
    var dataPersister = persisters.getPersister("api/");
    var start;
    var end;

    function errorsDiv(data) {
        $(".error").remove();
        var div = $("<div />").html(data).addClass("error");
        $("#main-content").append(div);
    }

    function getLoginViewModel(successCallback) {
        var viewModel = {
            username: "",
            password: "",
            email: "",

            login: function () {
                username = this.get("username");
                password = this.get("password");
                email = this.get("email")

                if (!username) {
                    errorsDiv("The username cannot be null")
                    return;
                }

                if (!password) {
                    errorsDiv("Password cannot be null")
                    return;
                }


                dataPersister.auth.login(username, password, email)
                .then(function () {
                    successCallback();
                });
            },
        };

        return kendo.observable(viewModel);
    }

    function getRegisterViewModel(successCallback) {
        var viewModel = {
            username: "",
            password: "",
            email: "",

            register: function () {
                username = this.get("username");
                password = this.get("password");
                email = this.get("email");
                
                if (!username) {
                    errorsDiv("The username cannot be null")
                    return;
                }

                if (!password) {
                    errorsDiv("The password cannot be null")
                    return;
                }

                if (!email) {
                    errorsDiv("The email cannot be null")
                    return;
                }

                dataPersister.users.register(username, password, email)
                .then(function () {
                    if (successCallback()) {
                        successCallback();
                    }
                });
            }
        };

        return kendo.observable(viewModel);
    }
   
    function getAppointmentsViewModel() {
        return dataPersister.appointments.all()
        .then(function (appointments) {
            var viewModel = {
                appointments: appointments,
                message: ""
            };

            return kendo.observable(viewModel);
        });
    }

    function getAppointmentsByDateViewModel(date) {
        return dataPersister.appointments.byDate(date)
        .then(function (appointments) {
            var viewModel = {
                appointments: appointments,
                message: ""
            };

            return kendo.observable(viewModel);
        });
    }

    function getListViewModel() {
        return dataPersister.lists.all()
        .then(function (lists) {
            var viewModel = {
                lists: lists,
                message: ""
            };

            return kendo.observable(viewModel);
        });
    }

    function getSingleListViewModel(id, successCallback) {
        return dataPersister.lists.single(id)
            .then(function (list) {
            var viewModel = {
                id : list.id,
                title: list.title,
                todos: list.todos,
                text: "",

                changeState: function (id) {
                    dataPersister.todos.changeStatus(id).then(function() {
                        successCallback();
                    })
                },

                addTodo: function () {
                    dataPersister.lists.addTodo(list.id, this.get("text")).then(function () {
                        successCallback();
                    });
                        
                }
            };
            console.log(viewModel)
            return kendo.observable(viewModel);
        })
    }

    function datePicker() {
        function startChange() {
            var startDate = start.value(),
            endDate = end.value();

            if (startDate) {
                startDate = new Date(startDate);
                startDate.setDate(startDate.getDate());
                end.min(startDate);
            }
            else if (endDate) {
                start.max(new Date(endDate));
            }
            else {
                endDate = new Date();
                start.max(endDate);
                end.min(endDate);
            }
        }

        function endChange() {
            var endDate = end.value(),
            startDate = start.value();

            if (endDate) {
                endDate = new Date(endDate);
                endDate.setDate(endDate.getDate());
                start.max(endDate);
            }
            else if (startDate) {
                end.min(new Date(startDate));
            }
            else {
                endDate = new Date();
                start.max(endDate);
                end.min(endDate);
            }
        }

        start = $("#start").kendoDatePicker({
            change: startChange,
            format: "yyyy/MM/dd"
        }).data("kendoDatePicker");

        end = $("#end").kendoDatePicker({
            change: endChange,
            format: "yyyy/MM/dd"
        }).data("kendoDatePicker");

        start.max(end.value());
        end.min(start.value());
    }

    return {
        getLoginViewModel: getLoginViewModel,
        getRegisterViewModel: getRegisterViewModel,
        datePicker: datePicker,
        getAppointmentsViewModel: getAppointmentsViewModel,
        getAppointmentsByDateViewModel: getAppointmentsByDateViewModel,
        getListViewModel: getListViewModel,
        getSingleListViewModel: getSingleListViewModel
    }
}());