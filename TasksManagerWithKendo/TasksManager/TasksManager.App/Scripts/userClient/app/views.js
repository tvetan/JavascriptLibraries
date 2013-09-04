/// <reference path="view-models.js" />
/// <reference path="templatesLoader.js" />
/// <reference path="../libs/_references.js" />

window.viewsFactory = (function() {
  
    function getLoginModel() {
        return templateLoader.loadTemplate("login-form");
    }

    function getRegisterModel() {
        return templateLoader.loadTemplate("register-form");
    }
    function getAppointmentsModel() {
        return templateLoader.loadTemplate("appointments");
    }

    function getListsModel() {
        return templateLoader.loadTemplate("lists");
    }

    function getSingleListModel() {
        return templateLoader.loadTemplate("single-list");
    }
    return {
        getLoginModel: getLoginModel,
        getRegisterModel: getRegisterModel,
        getAppointmentsModel: getAppointmentsModel,
        getListsModel: getListsModel,
        getSingleListModel: getSingleListModel
    };
}());