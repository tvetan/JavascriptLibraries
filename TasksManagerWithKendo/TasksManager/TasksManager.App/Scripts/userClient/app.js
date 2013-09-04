/// <reference path="libs/_references.js" />
/// <reference path="../userClient/app/views.js" />
/// <reference path="../userClient/app/view-models.js" />

(function () {
    var dataPersister = persisters.getPersister("/api/");
    var appLayout =
    new kendo.Layout('<div id="main-content"></div>');
    var router = new kendo.Router();

    router.route("/", function () {
        router.navigate("/home")
    });

    router.route("/home", function () {
        $("#main-content").empty();
        if (!dataPersister.isUserLoggedIn()) {
            $("#btn-logout").addClass("hidden");
            $("#btn-login").removeClass("hidden");
            $("#btn-register").removeClass("hidden");
        }
        else if (dataPersister.isUserLoggedIn()) {
            $("#btn-logout").removeClass("hidden");
            $("#btn-login").addClass("hidden");
            $("#btn-register").addClass("hidden");
        }
    });

    router.route("/login", function () {
        if (dataPersister.isUserLoggedIn()) {
            router.navigate("/home");
            $("#btn-logout").removeClass("hidden");
        }
        else {
            viewsFactory.getLoginModel() // getting html template here
            .then(function (loginViewHtml) {
                var loginViewModel = viewModelsFactory.getLoginViewModel(function () {
                    router.navigate("/home");
                    $("#btn-logout").removeClass("hidden");
                    $("#main-content").html("")
                }); //data model

                $("#main-content").empty();
                var view = new kendo.View(loginViewHtml, { model: loginViewModel }); //view 
                appLayout.showIn("#main-content", view);
            });
        }
    });

    router.route("/logout", function () {
        dataPersister.users.logout().then(function () {
            $("#btn-logout").addClass("hidden");
            router.navigate("/home");
        });
    });

    router.route("/register", function () {
        viewsFactory.getRegisterModel() // getting html template here
        .then(function (registerViewHtml) {
            var registerViewModel = viewModelsFactory.getRegisterViewModel(function () {
                router.navigate("/login");
            }); 

            var view = new kendo.View(registerViewHtml, { model: registerViewModel }); //view 
            appLayout.showIn("#main-content", view);
        });
    });

    router.route("/appointments", function () {
        viewsFactory.getAppointmentsModel()
        .then(function (appointmentModel) {
            viewModelsFactory.getAppointmentsViewModel().then(function (appointmentVM) {
                var view = new kendo.View(appointmentModel, { model: appointmentVM });
                $("#main-content").empty();

                appLayout.showIn("#main-content", view);
            }, function (err) {
                console.log(err);
            })
        });
    })

    router.route("/appointments/add", function () {
        var subject = $("#subject").val();
        var description = $("#description").val();
        var appointmentDate = $("#appointmentDate").val();
        var duration = $("#appointmentDate").val();

        dataPersister.appointments.create(subject, description, appointmentDate, duration)
        .then(function () {
            router.navigate("/appointments");
        }, function () {
        });
    })

    router.route("/appointments/filter", function () {
        var date = $("#appoinmentDate").val();
        viewsFactory.getAppointmentsModel()
        .then(function (appointmentModel) {
            viewModelsFactory.getAppointmentsByDateViewModel(date).then(function (appointmentVM) {
                var view = new kendo.View(appointmentModel, { model: appointmentVM });
                $("#main-content").empty();

                appLayout.showIn("#main-content", view);
            }, function (err) {
                console.log(err);
            })
        });
    })

    router.route("/todo-lists", function () {
        viewsFactory.getListsModel()
        .then(function (listModel) {
            viewModelsFactory.getListViewModel().then(function (listVM) {
                var view = new kendo.View(listModel, { model: listVM });
                $("#main-content").empty();

                appLayout.showIn("#main-content", view);
            }, function (err) {
                console.log(err);
            })
        });
    })

    router.route("/todo-lists/add", function () {
        var title = $("#todolistTitle").val();

        dataPersister.lists.create(title)
        .then(function () {
            router.navigate("/todo-lists");
        }, function () {
        });
    })

    router.route("/todo-list/:id", function (id) {
        viewsFactory.getSingleListModel()
        .then(function (singleListModel) {
            viewModelsFactory.getSingleListViewModel(id, function () {
                router.navigate("/todo-list/" + id + 1);
                router.navigate("/todo-list/" + id);
            })
            .then(function (singleListVM) {
                $("#main-content").html("");
                var view = new kendo.View(singleListModel, { model: singleListVM });
                appLayout.showIn("#main-content", view);
            }, function (err) {
                console.log(err + " in todo-list/:id");
            })
        })
    })
    router.route("/todos/changeState/:id", function (id) {
        dataPersister.todos.changeStatus(id);
    })

    $(function () {
        appLayout.render("#app");
        router.start();
    });
}());