define(
    ['core/module', 'lodash', 'marionette', 'payments/payment/model', 'template', 'payments/payment/controller', 'handlebars.runtime', 'marionette.approuter'],
    function(Module, _, Mn, PaymentModel, Template, Controller, Handlebars, AppRouter) {
        "use strict";

        return Module.extend({
            regions: {
                'paymentMethodData': '#payment-method-settings',
                'paymentMethodList': '.left-sidebar'
            },
            initialize: function() {
                var module = this;

                var model = new PaymentModel,
                    controller = new Controller(module, model);

                Handlebars.registerPartial('menuItem', Template.payment.menu_item);

                var view = Mn.View.extend({
                    template: Template.payment.menu,
                    el: '#payment-method-tabs',
                    router: null,
                    modelEvents: {
                        sync: 'render'
                    },
                    initialize: function() {
                        this.model.fetch({success: _.bind(this.setRoutes, this)});
                    },
                    setRoutes: function() {
                        var router = this.getOption('router'),
                            enabled = _.clone(this.model.get('enabled')),
                            disabled = _.clone(this.model.get('disabled'));

                        var initialRoute = _.head(_.values(enabled));

                        if (_.isUndefined(initialRoute)) {
                            initialRoute = _.head(_.values(disabled));
                        }

                        _.each(_.merge(enabled, disabled), function(item) {
                            router.appRoute(item, 'showMethod');
                        });

                        setTimeout(function() {
                            controller.showMethod(initialRoute);
                        }, 0);
                    }
                });

                var menuView = new view({
                    model: model,
                    router: new AppRouter({
                        controller: Controller(module, model)
                    })
                });

                this.app.showChildView('paymentMethodList', menuView);
            }
        });
    });