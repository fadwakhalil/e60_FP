(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.Sidekick = {
    Collections: {},
    Models: {},
    Views: {}
  };

  window.registerInputs = function() {
    var similar_domains;
    similar_domains = [];
    $('input[name="Similar Domain"]').each(function() {
      return similar_domains.push($(this).val());
    });
    return {
      domain: $('input[name="Website"]').val(),
      company_name: $('input[name="Company"]').val(),
      revenue: $('input[name="Revenue"]').val(),
      employees: $('input[name="Employees"]').val(),
      state: $('input[name="State"]').val(),
      phone_number: $('input[name="Phone"]').val(),
      email: $('input[name="Email"]').val(),
      name: $('input[name="name"]').val(),
      overview: $('<div/>').html($('input[name="Description"]').val()).text(),
      last_touch_date: $('input[name="LastTouchDate"]').val(),
      similar_domains: similar_domains
    };
  };

  window.sendMsg = function(type, data) {
    return window.postMessage({
      sender: "SIGNALS_WEBAPP",
      type: type,
      data: data
    }, "*");
  };

  window.track_stats = {};

  window.resetTrackStats = function() {
    return window.track_stats = {};
  };

  window.sendInsightsTrack = function() {
    if (!window.app_config.get('is_user_profile')) {
      if (window.app_config.get('is_contact') === true) {
        if ((window.track_stats.insights_open != null) && (window.track_stats.insights_has_contact_socialintel_data != null) && (window.track_stats.insights_has_contact_stream_data != null) && (window.track_stats.tracked_insights == null)) {
          window.track_stats.tracked_insights = true;
          if (window.app_config.get('is_gmail')) {
            console.info("INSIGHTS: Contact View in Gmail");
          } else {
            console.info("INSIGHTS: Contact View");
          }
          return $.post('/track/insight', {
            has_contact_socialintel_data: window.track_stats.insights_has_contact_socialintel_data,
            has_contact_stream_data: window.track_stats.insights_has_contact_stream_data,
            is_gmail: window.app_config.get('is_gmail'),
            is_contact: true
          }, function(data, textStatus, jqXHR) {});
        }
      } else {
        if ((window.track_stats.insights_has_contacts != null) && (window.track_stats.insights_open != null) && (window.track_stats.insights_has_company_data != null) && (window.track_stats.tracked_insights == null)) {
          window.track_stats.tracked_insights = true;
          if (window.app_config.get('is_gmail')) {
            console.info("INSIGHTS: Company View in Gmail");
          } else {
            console.info("INSIGHTS: Company View");
          }
          return $.post('/track/insight', {
            has_contacts: window.track_stats.insights_has_contacts,
            has_company_data: window.track_stats.insights_has_company_data,
            is_gmail: window.app_config.get('is_gmail')
          }, function(data, textStatus, jqXHR) {});
        }
      }
    }
  };

  
//http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
;

  $(document).ready(function() {
    var app, app_config, initial_contact, _ref;
    olark('api.box.hide');
    Backbone.$ = $;
    $.ajaxSetup({
      xhrFields: {
        withCredentials: true
      }
    });
    app_config = {
      is_local: $('input[name="is_local"]').val() === 'False' ? false : true,
      email: $('input[name="email"]').val(),
      has_salesforce: $('input[name="has_salesforce"]').val() === 'False' ? false : true,
      has_hubspot: $('input[name="has_hubspot"]').val() === 'False' ? false : true,
      has_insights_plus: $('input[name="has_insights_plus"]').val() === 'False' ? false : true,
      has_inbox_connected: $('input[name="has_inbox_connected"]').val() === 'False' ? false : true,
      has_leadpeek: $('input[name="has_leadpeek"]').val() === 'False' ? false : true,
      is_gmail: getURLParameter('gmail') === 'true' ? true : false,
      is_contact: $('input[name="is_contact"]').val() === 'true' ? true : false,
      user_hash: $('input[name="user_hash"]').length > 0 ? $('input[name="user_hash"]').val() : false,
      freemail_domains: $('input[name="freemail_domains"]').length < 1 ? false : JSON.parse(decodeURIComponent($('input[name="freemail_domains"]').val())),
      is_user_profile: $('input[name="is_user_profile"]').val() !== 'True' ? false : true,
      hubspot_owner: $('input[name="hubspot_owner"]').val() === 'None' ? false : JSON.parse(decodeURIComponent($('input[name="hubspot_owner"]').val()))[0],
      is_migrated: $('input[name="is_migrated"]').val() !== 'True' ? false : true
    };
    app_config.has_java_stream = (((_ref = app_config.email) === "gmahendran@hubspot.com" || _ref === "zklapow@hubspot.com") || app_config.is_migrated) && !app_config.is_local;
    window.app_config = new Sidekick.Models.AppConfig(app_config);
    if (window.app_config.get('is_contact') === true) {
      initial_contact = new Sidekick.Models.Contact(registerInputs());
    } else {
      initial_contact = new Sidekick.Models.Company(registerInputs());
    }
    app = new Sidekick.Views.App({
      model: initial_contact
    });
    $('a[href="#invite-admin-modal"]').click(function() {
      window.open('/stream?invite_admin=true', '_blank');
      return $.post('/notify', {
        msg: 'clicked "Pass the bill." from an expired Insight.'
      }, function(data, textStatus, jqXHR) {});
    });
    $('a[href="#personal-upgrade-modal"]').click(function() {
      window.open('/stream?pay_personal=true', '_blank');
      return $.post('/notify', {
        msg: 'clicked "Pay for myself." from an expired Insight.'
      }, function(data, textStatus, jqXHR) {});
    });
    $('.blurred-sidekick a:not(.request-upgrade-cta)').click(function() {
      return $.post('/notify', {
        msg: 'clicked "Upgrade" from an expired Insight.',
        color: 'purple'
      }, function(data, textStatus, jqXHR) {});
    });
    $('.blurred-sidekick a.request-upgrade-cta').click(function() {
      return $.post('/billing/team/request-insights-upgrade', function(data, textStatus, jqXHR) {});
    });
    return $("html").bind('DOMSubtreeModified', function() {
      if ($('html').width() === 245) {
        $("html").unbind('DOMSubtreeModified');
        window.track_stats.insights_open = true;
        return window.sendInsightsTrack();
      }
    });
  });

  _.extend(Backbone, {
    mixin: function(klass, mixin, merge) {
      var base, func, hp, name, prototype, sup;
      if (!mixin) {
        debugger;
      }
      mixin = mixin.prototype || mixin;
      merge || (merge = ["events"]);
      sup = _.extend({}, klass.__super__);
      for (name in mixin) {
        func = mixin[name];
        if (base = sup[name] && _.isFunction(base)) {
          sup[name] = function() {
            func.apply(this, arguments);
            return base.apply(this, arguments);
          };
        } else {
          sup[name] = func;
        }
      }
      hp = {}.hasOwnProperty;
      prototype = klass.prototype;
      for (name in mixin) {
        func = mixin[name];
        if (!hp.call(mixin, name)) {
          continue;
        }
        if (_(merge).contains(name)) {
          continue;
        }
        if (!prototype[name]) {
          prototype[name] = func;
        }
      }
      klass.__super__ = sup;
      _(merge).each(function(name) {
        if (mixin[name]) {
          return prototype[name] = _.extend({}, mixin.events, prototype.events);
        }
      });
      return this;
    }
  });

  Sidekick.Models.AppConfig = (function(_super) {
    __extends(AppConfig, _super);

    function AppConfig() {
      return AppConfig.__super__.constructor.apply(this, arguments);
    }

    AppConfig.prototype.initialize = function(data) {
      return this.set(data);
    };

    return AppConfig;

  })(Backbone.Model);

  (function() {
    var _base;
    return (_base = Array.prototype).some != null ? _base.some : _base.some = function(callback) {
      var element, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        element = this[_i];
        if (callback(element)) {
          return true;
        }
      }
      return false;
    };
  })();

  (function() {
    if (!Object.keys) {
      return Object.keys = function(obj) {
        var i, keys;
        keys = [];
        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            keys.push(i);
          }
        }
        return keys;
      };
    }
  })();

  Sidekick.Models.Lead = (function(_super) {
    __extends(Lead, _super);

    function Lead() {
      this.getHubspotUrl = __bind(this.getHubspotUrl, this);
      this.registerHubSpotStatuses = __bind(this.registerHubSpotStatuses, this);
      return Lead.__super__.constructor.apply(this, arguments);
    }

    Lead.prototype.defaults = {
      status: null,
      add_lead_state: null,
      salesforce_instance_url: null,
      salesforce_error_message: null,
      can_add_leads: null,
      DEPARTMENT_BUCKETS: [
        {
          'type': 'EXECUTIVE',
          'label': 'Executive',
          'displayOrder': 0,
          'keywords': ['VP', 'founder', 'founding', 'executive', 'CEO', 'CTO', 'CMO', 'CFO', 'officer', 'director', 'president', 'general manager']
        }, {
          'type': 'MARKETING',
          'label': 'Marketing',
          'displayOrder': 1,
          'keywords': ['marketing', 'marketer', 'inbound', 'growth', 'advertising', 'advertiser', 'content', 'blog']
        }, {
          'type': 'SALES',
          'label': 'Sales',
          'displayOrder': 2,
          'keywords': ['sales', 'representative', 'business', 'account']
        }, {
          'type': 'ENGINEERING',
          'label': 'Engineering',
          'displayOrder': 3,
          'keywords': ['IT', 'web', 'programmer', 'engineer', 'product', 'programming', 'content', 'blog', 'software', 'tech', 'UX', 'UI', 'design', 'architect']
        }, {
          'type': 'HR',
          'label': 'HR',
          'displayOrder': 4,
          'keywords': ['HR ', 'recruit', 'wellness', 'human resource']
        }, {
          'type': 'FINANCE',
          'label': 'Finance',
          'displayOrder': 5,
          'keywords': ['finance', 'financial', 'accounting', 'payroll']
        }, {
          'type': 'OTHER',
          'label': 'Other',
          'displayOrder': 6,
          'keywords': []
        }
      ]
    };

    Lead.prototype.initialize = function(data) {
      this.set(data);
      return this.registerHubSpotStatuses();
    };

    Lead.prototype.registerHubSpotStatuses = function() {
      this.set('hubspot_statuses', [
        {
          "label": "New",
          "value": "NEW"
        }, {
          "label": "Open",
          "value": "OPEN"
        }, {
          "label": "In Progress",
          "value": "IN_PROGRESS"
        }, {
          "label": "Unqualified",
          "value": "UNQUALIFIED"
        }
      ]);
      return this.set('hubspot_lifecycle_stages', [
        {
          "label": "Lead",
          "value": "lead"
        }, {
          "label": "Subscriber",
          "value": "subscriber"
        }, {
          "label": "Marketing Qualified Lead",
          "value": "marketingqualifiedlead"
        }, {
          "label": "Sales Qualified Lead",
          "value": "salesqualifiedlead"
        }, {
          "label": "Opportunity",
          "value": "opportunity"
        }, {
          "label": "Customer",
          "value": "customer"
        }, {
          "label": "Evangelist",
          "value": "evangelist"
        }, {
          "label": "Other",
          "value": "other"
        }
      ]);
    };

    Lead.prototype.getHubspotUrl = function() {
      return this.get('crm_base_url') + '/' + this.get('id');
    };

    Lead.prototype.registerHSCRMStatus = function(records_json) {
      var company, contact, deal, existing_records, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      this.set('hubspot_base_url', records_json.hubspot_base_url);
      this.set('crm_base_url', records_json.hubspot_base_url);
      existing_records = new Sidekick.Models.HSCRMRecordSet();
      if (records_json.companySet) {
        _ref = records_json.companySet;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          company = _ref[_i];
          company['crm_base_url'] = records_json.hubspot_base_url;
          existing_records.addCompany(company);
          if (company.dealSet) {
            _ref1 = company.dealSet.deals;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              deal = _ref1[_j];
              deal['crm_base_url'] = records_json.hubspot_base_url;
              existing_records.addDeal(deal);
            }
          }
          if (company.contactSet && company.contactSet.contacts) {
            _ref2 = company.contactSet.contacts;
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              contact = _ref2[_k];
              contact['crm_base_url'] = records_json.hubspot_base_url;
              existing_records.addContact(contact);
            }
          }
        }
      } else if (records_json.contactSet && records_json.contactSet.contacts) {
        _ref3 = records_json.contactSet.contacts;
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          contact = _ref3[_l];
          contact['crm_base_url'] = records_json.hubspot_base_url;
          existing_records.addContact(contact);
        }
      }
      this.set('existing_records', existing_records);
    };

    Lead.prototype.removeRecords = function() {
      var existing_records, model, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      existing_records = this.get('existing_records');
      if (existing_records && existing_records.toJSON()) {
        while ((model = (_ref = existing_records.get('object_primary')) != null ? _ref.first() : void 0)) {
          model.id = null;
          model.destroy();
        }
        if ((_ref1 = existing_records.get('object_primary')) != null) {
          _ref1.reset();
        }
        while ((model = (_ref2 = existing_records.get('object_secondary')) != null ? _ref2.first() : void 0)) {
          model.id = null;
          model.destroy();
        }
        if ((_ref3 = existing_records.get('object_secondary')) != null) {
          _ref3.reset();
        }
        while ((model = (_ref4 = existing_records.get('object_tertiary')) != null ? _ref4.first() : void 0)) {
          model.id = null;
          model.destroy();
        }
        if ((_ref5 = existing_records.get('object_tertiary')) != null) {
          _ref5.reset();
        }
        while ((model = (_ref6 = existing_records.get('object_quaternary')) != null ? _ref6.first() : void 0)) {
          model.id = null;
          model.destroy();
        }
        if ((_ref7 = existing_records.get('object_quaternary')) != null) {
          _ref7.reset();
        }
      }
      return this.set('existing_records', null);
    };

    Lead.prototype.registerLeadStatus = function(lead_status_json) {
      var account_record_json, contact_record_json, error, existing_records, lead_record_json, opportunity_record_json, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      this.set('add_lead_state', lead_status_json.input_lead_status);
      this.set('salesforce_instance_url', lead_status_json.salesforce_instance_url);
      this.set('can_add_leads', lead_status_json.can_add_leads);
      window.localStorage['can_add_leads'] = lead_status_json.can_add_leads;
      try {
        this.set('salesforce_error_message', $.parseJSON(lead_status_json.error));
      } catch (_error) {
        error = _error;
        this.set('salesforce_error_message', [
          {
            error: true,
            message: lead_status_json.error
          }
        ]);
      } finally {
        if (this.get('salesforce_error_message') && this.get('salesforce_error_message').length > 0) {
          if (/REST/i.test(this.get('salesforce_error_message')[0].message)) {
            $.post('/notify', {
              msg: 'has a REST API error on insights.',
              color: 'yellow'
            }, function(data, textStatus, jqXHR) {});
          }
        }
      }
      this.set('status', lead_status_json.lead_status);
      existing_records = new Sidekick.Models.SalesforceRecordSet({
        salesforce_instance_url: lead_status_json.salesforce_instance_url
      });
      if (lead_status_json.existing_records) {
        if (lead_status_json.existing_records.leads) {
          _ref = lead_status_json.existing_records.leads;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            lead_record_json = _ref[_i];
            existing_records.addLead(lead_record_json);
          }
        }
        if (lead_status_json.existing_records.opportunities) {
          _ref1 = lead_status_json.existing_records.opportunities;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            opportunity_record_json = _ref1[_j];
            existing_records.addOpportunity(opportunity_record_json);
          }
        }
        if (lead_status_json.existing_records.accounts) {
          _ref2 = lead_status_json.existing_records.accounts;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            account_record_json = _ref2[_k];
            existing_records.addAccount(account_record_json);
          }
        }
        if (lead_status_json.existing_records.contacts) {
          _ref3 = lead_status_json.existing_records.contacts;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            contact_record_json = _ref3[_l];
            existing_records.addContact(contact_record_json);
          }
        }
      }
      this.set('existing_records', existing_records);
      this.trigger('change:existing_records');
      return this.trigger('change');
    };

    Lead.prototype.get_webapp_url = function(url) {
      var attachment;
      if (window.app_config.get('user_hash')) {
        if (__indexOf.call(url, '?') >= 0) {
          attachment = '&';
        } else {
          attachment = '?';
        }
        url = "" + url + attachment + "user_hash=" + (window.app_config.get('user_hash'));
      }
      return url;
    };

    return Lead;

  })(Backbone.Model);

  Sidekick.Models.Company = (function(_super) {
    __extends(Company, _super);

    function Company() {
      this.setConnectionAsLead = __bind(this.setConnectionAsLead, this);
      this.setContactAsLead = __bind(this.setContactAsLead, this);
      this.setLocalTime = __bind(this.setLocalTime, this);
      this.registerCompanyData = __bind(this.registerCompanyData, this);
      this.registerRelatedCompanies = __bind(this.registerRelatedCompanies, this);
      this.registerContacts = __bind(this.registerContacts, this);
      this.guessContactEmail = __bind(this.guessContactEmail, this);
      this.registerContactSocialIntel = __bind(this.registerContactSocialIntel, this);
      this.retrieveContactSocialIntel = __bind(this.retrieveContactSocialIntel, this);
      this.addContact = __bind(this.addContact, this);
      this.registerCompanyConnectionData = __bind(this.registerCompanyConnectionData, this);
      this.retrieveCompanyConnectionData = __bind(this.retrieveCompanyConnectionData, this);
      this.retrieveCompanyData = __bind(this.retrieveCompanyData, this);
      this.retrieveData = __bind(this.retrieveData, this);
      return Company.__super__.constructor.apply(this, arguments);
    }

    Company.prototype.initialize = function(data) {
      Company.__super__.initialize.call(this, data);
      this.set('type', 'company');
      this.retrieveData();
      return this;
    };

    Company.prototype.retrieveData = function() {
      this.retrieveCompanyData();
      this.retrieveCompanyConnectionData();
    };

    Company.prototype.retrieveCompanyData = function(gae_passthrough, timer) {
      var url;
      if (gae_passthrough == null) {
        gae_passthrough = false;
      }
      if (timer == null) {
        timer = null;
      }
      this.set('company_data_status', 'loading');
      if (gae_passthrough) {
        url = this.get_webapp_url("/companies/sidekick/" + (this.get('domain')) + "/company_data.json");
      } else {
        url = "" + window.api_base + "/biden/v1/companies/" + (this.get('domain'));
      }
      if (!timer) {
        timer = new Date().getTime() + (20 * 1000);
      }
      return $.ajax({
        dataType: "json",
        url: url,
        data: "",
        xhrFields: {
          withCredentials: true
        },
        success: (function(_this) {
          return function(data, textStatus, jqXHR) {
            var waitRetrieveCompanyData;
            if (data && typeof data === 'object' && Object.keys(data).length) {
              _this.registerCompanyData(data);
              if (data.refreshPending && new Date().getTime() < timer) {
                waitRetrieveCompanyData = function() {
                  return _this.retrieveCompanyData(gae_passthrough, timer);
                };
                return setTimeout(waitRetrieveCompanyData, 5000);
              }
            } else {
              return _this.registerCompanyData({
                error: true
              });
            }
          };
        })(this),
        error: (function(_this) {
          return function(jqXHR, textStatus, errorFound) {
            if (!gae_passthrough && jqXHR.status !== 404) {
              if (typeof console !== "undefined" && console !== null) {
                console.error("Error accessing " + window.api_base + ". Using GAE Pass-through instead.");
              }
              return _this.retrieveCompanyData(gae_passthrough = true);
            } else {
              return _this.registerCompanyData({
                error: true
              });
            }
          };
        })(this)
      });
    };

    Company.prototype.retrieveCompanyConnectionData = function() {
      var url;
      if (window.app_config.get('has_inbox_connected')) {
        url = "" + window.server_base + "/companies/sidekick/" + (this.get('domain')) + "/connections.json";
        $.ajax({
          dataType: "json",
          url: url,
          data: "",
          xhrFields: {
            withCredentials: true
          },
          success: (function(_this) {
            return function(data, textStatus, jqXHR) {
              return _this.registerCompanyConnectionData(data);
            };
          })(this),
          error: (function(_this) {
            return function(xhr, status, error) {
              if (typeof console !== "undefined" && console !== null) {
                console.info('response');
              }
              if (typeof console !== "undefined" && console !== null) {
                console.debug(xhr);
              }
              if (typeof console !== "undefined" && console !== null) {
                console.debug(error);
              }
              return typeof console !== "undefined" && console !== null ? console.debug(status) : void 0;
            };
          })(this)
        });
      } else {
        this.registerCompanyConnectionData(null);
      }
    };

    Company.prototype.registerCompanyConnectionData = function(company_connections_json) {
      if (company_connections_json && company_connections_json.last_touch) {
        this.set('last_touch_date', company_connections_json.last_touch.datestr);
      } else {
        this.set('last_touch_date', null);
      }
      if (company_connections_json && company_connections_json.connections.length > 0) {
        this.set('company_connections', company_connections_json.connections);
      } else {
        this.set('company_connections', null);
      }
      this.trigger('change:company_connections');
    };

    Company.prototype.addContact = function(fullname, role) {
      var company_contacts, contact, getContactSocialIntel, index;
      contact = {
        name: fullname
      };
      index = 0;
      company_contacts = this.get('company_contacts');
      if (!company_contacts || company_contacts === "none") {
        company_contacts = {};
        company_contacts[role] = [contact];
      } else {
        company_contacts[role].unshift(contact);
      }
      this.set('company_contacts', company_contacts);
      getContactSocialIntel = (function(_this) {
        return function() {
          return _this.retrieveContactSocialIntel(role, index);
        };
      })(this);
      this.guessContactEmail(role, index, getContactSocialIntel);
    };

    Company.prototype.retrieveContactSocialIntel = function(role, contact_index) {
      var url;
      url = this.get_webapp_url("/contacts/" + (this.get('company_contacts')[role][contact_index].email) + "/socialintel.json");
      $.ajax({
        dataType: 'json',
        url: url,
        data: '',
        success: (function(_this) {
          return function(data, textStatus, jqXHR) {
            return _this.registerContactSocialIntel(role, contact_index, data);
          };
        })(this)
      });
    };

    Company.prototype.registerContactSocialIntel = function(role, contact_index, data) {
      var contact, contacts, _ref, _ref1, _ref2;
      contacts = this.get('company_contacts');
      contact = contacts[role][contact_index];
      contact.title = data != null ? (_ref = data.fullcontactDetails) != null ? (_ref1 = _ref.organizations) != null ? (_ref2 = _ref1[0]) != null ? _ref2.title : void 0 : void 0 : void 0 : void 0;
      contacts[role][contact_index] = contact;
      this.set('company_contacts', contacts);
      this.trigger('change:company_contacts');
    };

    Company.prototype.guessContactEmail = function(role, contact_index, callback, gae_passthrough, retry) {
      var contact, contacts, first_name, last_name, split_name, url;
      if (callback == null) {
        callback = false;
      }
      if (gae_passthrough == null) {
        gae_passthrough = false;
      }
      if (retry == null) {
        retry = 1;
      }
      contacts = this.get('company_contacts');
      contact = contacts[role][contact_index];
      if (contact.email_status == null) {
        if (!window.app_config.get('has_insights_plus') && !window.app_config.get('has_leadpeek')) {
          $.post('/notify', {
            msg: 'tried to guess an email.',
            color: 'purple'
          }, function(data, textStatus, jqXHR) {});
          contact.email_status = "UPGRADE";
          contact.email_status_message = "<a href='http://www.getsidekick.com/pql-lp' target='_blank'>Click to learn more.</a>";
          this.trigger('change:company_contacts');
          return;
        }
      }
      if (contact.calculated_email == null) {
        if (contact.email != null) {
          contact.email_status = "AVAILABLE";
          contact.calculated_email = contact.email;
        } else {
          contact.email_status = "GUESSING";
          contact.email_status_message = "Finding... (" + retry + ")";
        }
        this.trigger('change:company_contacts');
      }
      if (contact.name) {
        split_name = contact.name.split(' ');
        first_name = split_name[0];
        last_name = split_name[split_name.length - 1];
      } else {
        return;
      }
      if (gae_passthrough || window.app_config.get('has_leadpeek')) {
        url = this.get_webapp_url("/insights/contact_email.json");
      } else {
        url = "" + window.api_base + "/signals/v1/emails/guess";
      }
      return $.ajax({
        dataType: "json",
        url: url,
        data: "first=" + first_name + "&last=" + last_name + "&domain=" + (this.get('domain')),
        xhrFields: {
          withCredentials: true
        },
        success: (function(_this) {
          return function(data, textStatus, jqXHR) {
            var checkContactEmail;
            checkContactEmail = function() {
              if (typeof console !== "undefined" && console !== null) {
                console.debug(retry);
              }
              return _this.guessContactEmail(role, contact_index, callback, gae_passthrough = gae_passthrough, retry = retry + 1);
            };
            if (!data.complete && retry < 60 && !(window.app_config.get('has_leadpeek') && retry > 2)) {
              if (typeof console !== "undefined" && console !== null) {
                console.debug("retry is " + retry);
              }
              return setTimeout(checkContactEmail, 1000);
            } else {
              if (data.valid_emails && data.valid_emails.length > 0 && data.valid_emails[0].length > 0 && !data.has_catchall) {
                contact.calculated_email = data.valid_emails[0];
                contact.email = data.valid_emails[0];
                contact.email_status = "AVAILABLE";
                $.post('/notify', {
                  msg: 'guessed an email successfully.',
                  color: 'purple'
                }, function(data, textStatus, jqXHR) {});
                if (callback) {
                  callback();
                }
              } else {
                contact.email_status = "ERROR";
                if (data.has_catchall) {
                  contact.email_status_message = "Company denied access";
                } else {
                  contact.email_status_message = "No email found";
                }
                $.post('/notify', {
                  msg: 'guessed an email unsuccessfully.',
                  color: 'yellow'
                }, function(data, textStatus, jqXHR) {});
              }
              return _this.trigger('change:company_contacts');
            }
          };
        })(this),
        error: (function(_this) {
          return function(jqXHR, textStatus, errorThrown) {
            if (!gae_passthrough) {
              if (typeof console !== "undefined" && console !== null) {
                console.error("Error accessing " + window.api_base + ". Using GAE Pass-through instead.");
              }
              return _this.guessContactEmail(role, contact_index, callback, gae_passthrough = true);
            }
          };
        })(this)
      });
    };

    Company.prototype.registerContacts = function(company_contacts_json, role) {
      var MINIMUM_NUMBER_CONTACTS_FOR_BUCKETING, company_contacts, contact, contactString, department, _i, _j, _len, _len1, _ref;
      if (role == null) {
        role = false;
      }
      MINIMUM_NUMBER_CONTACTS_FOR_BUCKETING = 18;
      if (!company_contacts_json) {
        return;
      }
      if (company_contacts_json && company_contacts_json.length > 0) {
        company_contacts = {};
        for (_i = 0, _len = company_contacts_json.length; _i < _len; _i++) {
          contact = company_contacts_json[_i];
          if ((contact.department && contact.department === "NONE") || company_contacts_json.length < MINIMUM_NUMBER_CONTACTS_FOR_BUCKETING) {
            if (!('NONE' in company_contacts)) {
              company_contacts['NONE'] = [];
            }
            company_contacts['NONE'].push(contact);
            contact.has_department = true;
          } else {
            _ref = this.get('DEPARTMENT_BUCKETS');
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              department = _ref[_j];
              if (contact.department) {
                contactString = contact.department;
              } else if (contact.snippet) {
                contactString = contact.snippet;
              } else {
                contactString = '';
              }
              if (department.keywords.some(function(v) {
                if (contactString.indexOf('Past.') >= 0) {
                  contactString = contactString.slice(0, contactString.indexOf('Past.'));
                }
                return (contactString.toLowerCase().indexOf(v.toLowerCase()) >= 0) || (contact.title.toLowerCase().indexOf(v.toLowerCase()) >= 0);
              })) {
                if (!(department.type in company_contacts)) {
                  company_contacts[department.type] = [];
                }
                company_contacts[department.type].push(contact);
                contact.has_department = true;
              }
            }
            if (!contact.has_department) {
              if (!('OTHER' in company_contacts)) {
                company_contacts['OTHER'] = [];
              }
              company_contacts['OTHER'].push(contact);
              contact.has_department = true;
            }
          }
        }
        window.track_stats.insights_has_contacts = true;
        window.sendInsightsTrack();
        this.set('company_contacts', company_contacts);
      } else {
        this.set('company_contacts', 'none');
        window.track_stats.insights_has_contacts = false;
        window.sendInsightsTrack();
      }
      this.trigger('change:company_contacts');
    };

    Company.prototype.registerRelatedCompanies = function(similar_companies_json) {
      return this.set('related_companies', similar_companies_json);
    };

    Company.prototype.registerCompanyData = function(company_data_json) {
      var ARBITRARY_COMPANY_HAS_SUFFICIENT_DATA_THRESHOLD;
      if (company_data_json.error) {
        this.set('company_data_status', 'error');
        this.set('company_contacts', 'none');
        this.set('related_companies', []);
        return;
      }
      this.set('domain', company_data_json.domain);
      if (company_data_json.properties) {
        this.set('company_name', company_data_json.properties.name);
        this.set('twitter_name', company_data_json.properties.twitterusername);
        this.set('facebook_url', company_data_json.properties.facebookpageurl);
        this.set('linkedin_url', company_data_json.properties.linkedinurl);
        this.set('blogurl', company_data_json.properties.blogurl);
        this.set('zipcode', company_data_json.properties.zipcode);
        this.set('address1', company_data_json.properties.address1);
        this.set('address2', company_data_json.properties.address2);
        this.set('address', company_data_json.properties.address);
        if (company_data_json.properties.timezone != null) {
          this.setLocalTime(company_data_json.properties.timezone);
        }
        this.set('city', company_data_json.properties.city);
        this.set('country', company_data_json.properties.country);
        this.set('revenue', company_data_json.properties.revenue);
        this.set('employees', company_data_json.properties.employees);
        this.set('founded', company_data_json.properties.foundedyear);
        this.set('state', company_data_json.properties.state);
        this.set('phone_number', company_data_json.properties.phonenumber);
        this.set('overview', $('<div/>').html(company_data_json.properties.overview).text());
      }
      this.registerContacts(company_data_json.contacts);
      this.registerRelatedCompanies(company_data_json.relatedCompanies);
      this.set('company_data_status', 'loaded');
      ARBITRARY_COMPANY_HAS_SUFFICIENT_DATA_THRESHOLD = 12;
      if (company_data_json.properties && (Object.keys(company_data_json.properties).length > ARBITRARY_COMPANY_HAS_SUFFICIENT_DATA_THRESHOLD)) {
        window.track_stats.insights_has_company_data = true;
      } else {
        window.track_stats.insights_has_company_data = false;
      }
      window.sendInsightsTrack();
    };

    Company.prototype.setLocalTime = function(timezone) {
      var LOCAL_TIME_REFRESH_INTERVAL, updateLocalTime;
      updateLocalTime = (function(_this) {
        return function() {
          _this.set('local_time', moment().tz(timezone).format('h:mm A'));
        };
      })(this);
      updateLocalTime();
      LOCAL_TIME_REFRESH_INTERVAL = 60 * 1000;
      window.setInterval(updateLocalTime, LOCAL_TIME_REFRESH_INTERVAL);
    };

    Company.prototype.setContactAsLead = function(role, contact_index) {
      var contact, first_name, last_name, split_name;
      contact = this.get('company_contacts')[role][contact_index];
      this.set('status', 'new-lead');
      if (contact.name) {
        split_name = contact.name.split(' ');
        first_name = split_name[0];
        last_name = split_name[split_name.length - 1];
        this.set('first_name', first_name);
        if (last_name) {
          this.set('last_name', last_name);
        }
      }
      if (contact.title) {
        this.set('title', contact.title);
      }
      if (contact.email) {
        this.set('email', contact.email);
      }
    };

    Company.prototype.setConnectionAsLead = function(connection_index) {
      var contact, first_name, last_name, split_name;
      contact = this.get('company_connections')[connection_index];
      this.set('status', 'new-lead');
      if (contact.name) {
        split_name = contact.name.split(' ');
        first_name = split_name[0];
        last_name = split_name[split_name.length - 1];
      } else {
        if (window.app_config.get('has_hubspot')) {
          first_name = '';
          last_name = '';
        } else {
          first_name = contact.email;
          last_name = "| " + (this.get('domain'));
        }
      }
      this.set('first_name', first_name);
      this.set('last_name', last_name);
      if (contact.title) {
        this.set('title', contact.title);
      }
      if (contact.email) {
        this.set('email', contact.email);
      }
    };

    return Company;

  })(Sidekick.Models.Lead);

  Sidekick.Models.Contact = (function(_super) {
    __extends(Contact, _super);

    function Contact() {
      this.formatGAEActivityData = __bind(this.formatGAEActivityData, this);
      this.formatJavaActivityData = __bind(this.formatJavaActivityData, this);
      this.formatActivityData = __bind(this.formatActivityData, this);
      this.retrieveStreamData = __bind(this.retrieveStreamData, this);
      this.registerSocialIntel = __bind(this.registerSocialIntel, this);
      this.retrieveSocialIntel = __bind(this.retrieveSocialIntel, this);
      this.retrieveData = __bind(this.retrieveData, this);
      return Contact.__super__.constructor.apply(this, arguments);
    }

    Contact.prototype.initialize = function(data) {
      var company_data, contactCompany, domain;
      Contact.__super__.initialize.call(this, data);
      this.set('type', 'contact');
      this.set('avatar_url', "https://api.hubapi.com/socialintel/v1/avatars?email=" + (this.get('email')));
      domain = data.email.split('@')[1];
      if (!(__indexOf.call(window.app_config.get('freemail_domains'), domain) >= 0)) {
        company_data = _.clone(data);
        company_data.domain = domain;
        contactCompany = new Sidekick.Models.Company(company_data);
        this.set('company_object', contactCompany);
        this.trigger('change:company_object');
      }
      this.set('no-reply', this.isNoReplyEmail());
      if (this.get('no-reply')) {
        this.setNoReplyData();
      } else {
        this.retrieveData();
      }
      return this;
    };

    Contact.prototype.isNoReplyEmail = function() {
      var JUNK_EMAIL_INDICATORS, email;
      JUNK_EMAIL_INDICATORS = ["noreply", "no-reply", "donotreply", "do-not-reply", "support@", "info@", "daemon@"];
      email = this.get('email').replace(/-/g, "");
      return _.some(JUNK_EMAIL_INDICATORS, (function(_this) {
        return function(junk_segment) {
          return email.toLowerCase().indexOf(junk_segment) > -1;
        };
      })(this));
    };

    Contact.prototype.setNoReplyData = function() {
      this.set('name', null);
      this.set('title', "No contact information.");
    };

    Contact.prototype.retrieveData = function() {
      this.retrieveStreamData();
      this.retrieveSocialIntel();
    };

    Contact.prototype.retrieveSocialIntel = function() {
      var url;
      url = this.get_webapp_url("/contacts/" + (this.get('email')) + "/socialintel.json");
      $.ajax({
        dataType: 'json',
        url: url,
        data: '',
        timeout: 3800,
        success: (function(_this) {
          return function(data, textStatus, jqXHR) {
            return _this.registerSocialIntel(data);
          };
        })(this)
      });
    };

    Contact.prototype.registerSocialIntel = function(data) {
      var i, socialprofile, socialprofiles, temp_bio_container, _i, _len, _ref, _ref1;
      socialprofiles = [
        {
          'typeid': 'email',
          'typename': 'email',
          'iconname': 'icon-envelope',
          'url': "" + (this.get('email')),
          'email': true
        }
      ];
      if (data.facebookDetails) {
        if (data.facebookDetails.gender) {
          this.set('gender', data.facebookDetails.gender);
        }
        if (data.facebookDetails.name) {
          this.set('name', data.facebookDetails.name);
        }
        if (data.facebookDetails.url) {
          this.set('facebook_url', data.facebookDetails.url);
        }
        if (data.facebookDetails.username) {
          this.set('facebook_username', data.facebookDetails.username);
        }
      }
      if (data.fullcontactDetails) {
        if (data.fullcontactDetails.contactinfo) {
          if (data.fullcontactDetails.contactinfo.fullname && !this.get('name')) {
            this.set('name', data.fullcontactDetails.contactinfo.fullname);
          }
          if (data.fullcontactDetails.contactinfo.websites && !this.get('website')) {
            if (data.fullcontactDetails.contactinfo.websites[0]) {
              this.set('website', data.fullcontactDetails.contactinfo.websites[0].url);
            }
          }
        }
        if (data.fullcontactDetails.demographics) {
          if (data.fullcontactDetails.demographics.age && !this.get('age')) {
            this.set('age', data.fullcontactDetails.demographics.age);
          }
          if (data.fullcontactDetails.demographics.locationgeneral && !this.get('location')) {
            this.set('location', data.fullcontactDetails.demographics.locationgeneral);
          }
          if (data.fullcontactDetails.demographics.gender && !this.get('gender')) {
            this.set('gender', data.fullcontactDetails.demographics.gender);
          }
        }
        if (data.fullcontactDetails.organizations) {
          this.set('organizations', data.fullcontactDetails.organizations);
          if (data.fullcontactDetails.organizations[0]) {
            if (data.fullcontactDetails.organizations[0].title && !this.get('title')) {
              this.set('title', data.fullcontactDetails.organizations[0].title);
            }
            if (data.fullcontactDetails.organizations[0].name && !this.get('company_name')) {
              this.set('company_name', data.fullcontactDetails.organizations[0].name);
            }
          }
        }
        if (data.fullcontactDetails.socialprofiles) {
          _ref = data.fullcontactDetails.socialprofiles;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            socialprofile = _ref[i];
            if ((_ref1 = socialprofile.typeid) === 'twitter' || _ref1 === 'linkedin' || _ref1 === 'facebook' || _ref1 === 'digg' || _ref1 === 'foursquare' || _ref1 === 'youtube') {
              socialprofile.iconname = "icon-" + socialprofile.typeid;
              if (socialprofile.typeid === "youtube") {
                socialprofile.iconname = "icon-youtube-play";
              }
              if (socialprofile.typeid === "twitter") {
                if (!this.get('twitter_name')) {
                  this.set('twitter_name', socialprofile.username);
                }
              }
              socialprofiles.push(socialprofile);
            }
            if (!this.get('description') && socialprofile.bio) {
              temp_bio_container = document.createElement("div");
              temp_bio_container.innerHTML = socialprofile.bio;
              this.set('description', temp_bio_container.innerText);
            }
          }
        }
      }
      if (data.twitterDetails) {
        if (data.twitterDetails.name && !this.get('name')) {
          this.set('name', data.twitterDetails.name);
        }
        if (data.twitterDetails.url) {
          this.set('twitter_url', data.twitterDetails.url);
        }
        if (data.twitterDetails.screenname) {
          if (!this.get('twitter_name')) {
            this.set('twitter_name', data.twitterDetails.screenname);
          }
        }
        if (data.twitterDetails.description) {
          this.set('twitter_description', data.twitterDetails.description);
          this.set('description', data.twitterDetails.description);
        }
        if (data.twitterDetails.location) {
          this.set('location', data.twitterDetails.location);
        }
      }
      this.set('social_profiles', socialprofiles);
      if (this.get('name')) {
        this.set('first_name', this.get('name').split(' ')[0]);
        this.set('last_name', this.get('name').split(' ')[1]);
      }
      if (this.get('socialprofiles') || this.get('title') || this.get('description')) {
        window.track_stats.insights_has_contact_socialintel_data = true;
      } else {
        window.track_stats.insights_has_contact_socialintel_data = false;
      }
      window.sendInsightsTrack();
    };

    Contact.prototype.retrieveStreamData = function(gae_passthrough) {
      var url;
      if (!gae_passthrough && window.app_config.get('has_java_stream')) {
        if (window.app_config.get('is_user_profile') || (this.get('email') === window.app_config.get('email'))) {
          this.set('activities', []);
          return;
        } else {
          url = "" + window.api_base + "/signals/v1/activities/index/SECONDARY/" + (this.get('email'));
        }
      } else {
        url = this.get_webapp_url("/stream.json?email=" + (this.get('email')));
      }
      $.getJSON(url, '', (function(_this) {
        return function(data, textStatus, jqXHR) {
          if (data.activities && data.activities.length > 0) {
            _this.set('activities', _this.formatActivityData(data));
            window.track_stats.insights_has_contact_stream_data = true;
          } else {
            _this.set('activities', []);
            window.track_stats.insights_has_contact_stream_data = false;
          }
          return window.sendInsightsTrack();
        };
      })(this)).fail((function(_this) {
        return function() {
          if (!gae_passthrough) {
            if (typeof console !== "undefined" && console !== null) {
              console.error("Error accessing " + window.api_base + " for stream. Using GAE stream instead.");
            }
            return _this.retrieveStreamData(gae_passthrough = true);
          }
        };
      })(this));
    };

    Contact.prototype.formatActivityData = function(data) {
      if (data.after != null) {
        return this.formatJavaActivityData(data.activities);
      }
      return this.formatGAEActivityData(data.activities);
    };

    Contact.prototype.formatJavaActivityData = function(activities_json) {
      var activity, formatStory, formatted_activities_json, _i, _len, _ref, _ref1;
      formatStory = function(activity) {
        var email, name, story, _ref, _ref1, _ref2;
        if (activity.object_link) {
          email = '';
          name = '';
          if ((_ref = activity.source) != null ? _ref.email : void 0) {
            email = activity.source.email;
          }
          if (((_ref1 = activity.source) != null ? _ref1.name : void 0) && ((_ref2 = activity.source) != null ? _ref2.is_exact : void 0)) {
            name = activity.source.name;
          }
          story = "" + activity.verb + " <a class='activity-link view-contact-action' data-email='" + email + "' data-name='" + name + "' href='" + activity.object_link + "' target='_blank'>" + activity.object + "</a>";
        } else {
          story = "" + activity.verb + " " + activity.object;
        }
        return story;
      };
      formatted_activities_json = [];
      for (_i = 0, _len = activities_json.length; _i < _len; _i++) {
        activity = activities_json[_i];
        if (!activity.deleted && activity.type !== "EMAIL_TRACKER_CREATE") {
          activity.computed_email = (_ref = activity.source) != null ? _ref.email : void 0;
          activity.computed_avatar_url = activity.avatar_url;
          if (!activity.computed_avatar_url) {
            activity.computed_avatar_url = "https://api.hubapi.com/socialintel/v1/avatars?email=" + activity.computed_email;
          }
          activity.name = (_ref1 = activity.source) != null ? _ref1.name : void 0;
          if (!activity.name) {
            activity.name = activity.computed_email;
          }
          if (!activity.created) {
            activity.created = activity.timestamp;
          }
          if (activity.type === "EMAIL_OPEN") {
            activity.verb = 'Opened';
            activity.icon = 'icon-envelope';
          } else if (activity.type === "EMAIL_CLICK") {
            activity.verb = 'Clicked';
            activity.icon = 'icon-link';
          } else if (activity.type === "HUBSPOT_REVISIT") {
            activity.verb = 'Visited';
            activity.icon = 'icon-sprocket';
          } else if (activity.type === "SALESFORCE") {
            activity.verb = 'Became';
            activity.icon = 'icon-salesforce';
          } else if (activity.type === "PRESENTATION_REVISIT") {
            activity.verb = 'Viewed';
            activity.icon = 'icon-play';
          }
          if (!activity.story) {
            activity.story = formatStory(activity);
          }
          formatted_activities_json.push(activity);
        }
      }
      return formatted_activities_json;
    };

    Contact.prototype.formatGAEActivityData = function(activities_json) {
      var activity, formatted_activities_json, _i, _len;
      formatted_activities_json = [];
      for (_i = 0, _len = activities_json.length; _i < _len; _i++) {
        activity = activities_json[_i];
        if (activity.stream_display) {
          if (activity.activity_type === "EMAILOPEN") {
            activity.icon = 'icon-envelope';
          } else if (activity.activity_type === "EMAILCLICK") {
            activity.icon = 'icon-link';
          } else if (activity.activity_type === "HUBSPOT_REVISIT") {
            activity.icon = 'icon-sprocket';
          } else if (activity.activity_type === "SALESFORCE") {
            activity.icon = 'icon-salesforce';
          } else {
            activity.formatted_activity_type = activity.activity_type;
          }
          formatted_activities_json.push(activity);
        }
      }
      return formatted_activities_json;
    };

    return Contact;

  })(Sidekick.Models.Lead);

  Sidekick.Models.HSCRMRecord = (function(_super) {
    __extends(HSCRMRecord, _super);

    function HSCRMRecord() {
      this.getHubspotUrl = __bind(this.getHubspotUrl, this);
      return HSCRMRecord.__super__.constructor.apply(this, arguments);
    }

    HSCRMRecord.prototype.initialize = function(data) {
      if (data.properties.company) {
        this.set('company_name', data.properties.company.value);
      }
      if (data.properties.firstname) {
        this.set('first_name', data.properties.firstname.value);
      }
      if (data.properties.lastname) {
        this.set('last_name', data.properties.lastname.value);
      }
      if (data.properties.jobtitle) {
        this.set('title', data.properties.jobtitle.value);
      }
      if (data.properties.email) {
        this.set('email', data.properties.email.value);
      }
      if (data.properties.phone) {
        this.set('phone_number', data.properties.phone.value);
      }
      if (data.hubspot_owner) {
        this.set('owner_name', data.hubspot_owner.firstName + " " + data.hubspot_owner.lastName);
        this.set('owned_by_queue', false);
      }
      if (data.Id) {
        this.set('id', data.Id);
        this.set('salesforce_id', data.Id);
      }
      if (data.crm_base_url) {
        this.set('crm_base_url', data.crm_base_url);
      }
      if (data.properties.createdate) {
        return this.set('date', moment(parseInt(data.properties.createdate.value, 10)).format("YYYY-MM-DD"));
      }
    };

    HSCRMRecord.prototype.getHubspotUrl = function() {
      return this.get('crm_base_url') + '/' + this.get('id');
    };

    return HSCRMRecord;

  })(Backbone.Model);

  Sidekick.Models.HSCRMContact = (function(_super) {
    __extends(HSCRMContact, _super);

    function HSCRMContact() {
      return HSCRMContact.__super__.constructor.apply(this, arguments);
    }

    HSCRMContact.prototype.initialize = function(data) {
      var _ref, _ref1, _ref2;
      HSCRMContact.__super__.initialize.call(this, data);
      this.set('record_type', 'contact');
      if (data.vid) {
        this.set('id', "contacts/" + data.vid + "/");
        if ((_ref = data['associated-company']) != null ? _ref['company-id'] : void 0) {
          this.set('hubspot_company_id', data['associated-company']['company-id']);
        }
        if ((_ref1 = data['associated-company']) != null ? (_ref2 = _ref1.properties) != null ? _ref2.name : void 0 : void 0) {
          this.set('company_name', data['associated-company'].properties.name.value);
        }
      }
      if (data.properties.verified_email) {
        this.set('email', data.properties.verified_email.value);
      }
    };

    return HSCRMContact;

  })(Sidekick.Models.HSCRMRecord);

  Sidekick.Models.HSCRMDeal = (function(_super) {
    __extends(HSCRMDeal, _super);

    function HSCRMDeal() {
      return HSCRMDeal.__super__.constructor.apply(this, arguments);
    }

    HSCRMDeal.prototype.initialize = function(data) {
      HSCRMDeal.__super__.initialize.call(this, data);
      this.set('record_type', 'deal');
      if (data.dealId) {
        this.set('id', "deals/" + data.dealId + "/");
        this.set('hubspot_company_id', data.associations.associatedCompanyIds[0]);
      }
      if (data.properties.dealname) {
        this.set('company_name', data.properties.dealname.value);
        this.set('name', "" + data.properties.dealname.value);
      }
    };

    return HSCRMDeal;

  })(Sidekick.Models.HSCRMRecord);

  Sidekick.Models.HSCRMCompany = (function(_super) {
    __extends(HSCRMCompany, _super);

    function HSCRMCompany() {
      return HSCRMCompany.__super__.constructor.apply(this, arguments);
    }

    HSCRMCompany.prototype.initialize = function(data) {
      HSCRMCompany.__super__.initialize.call(this, data);
      this.set('record_type', 'company');
      if (data['company-id']) {
        this.set('id', "companies/" + data['company-id'] + "/");
        this.set('hubspot_company_id', data['company-id']);
      } else if (data['companyId']) {
        this.set('id', "companies/" + data['companyId'] + "/");
        this.set('hubspot_company_id', data['companyId']);
      }
      if (data.properties.name) {
        this.set('company_name', data.properties.name.value);
        this.set('name', "" + data.properties.name.value);
      } else {
        this.set('company_name', data.properties.domain.value);
        this.set('name', "" + data.properties.domain.value);
      }
    };

    return HSCRMCompany;

  })(Sidekick.Models.HSCRMRecord);

  Sidekick.Collections.HSCRMCompanies = (function(_super) {
    __extends(HSCRMCompanies, _super);

    function HSCRMCompanies() {
      return HSCRMCompanies.__super__.constructor.apply(this, arguments);
    }

    HSCRMCompanies.prototype.model = Sidekick.Models.HSCRMCompany;

    HSCRMCompanies.prototype.url = null;

    return HSCRMCompanies;

  })(Backbone.Collection);

  Sidekick.Collections.HSCRMDeals = (function(_super) {
    __extends(HSCRMDeals, _super);

    function HSCRMDeals() {
      return HSCRMDeals.__super__.constructor.apply(this, arguments);
    }

    HSCRMDeals.prototype.model = Sidekick.Models.HSCRMDeal;

    HSCRMDeals.prototype.url = null;

    return HSCRMDeals;

  })(Backbone.Collection);

  Sidekick.Collections.HSCRMContacts = (function(_super) {
    __extends(HSCRMContacts, _super);

    function HSCRMContacts() {
      return HSCRMContacts.__super__.constructor.apply(this, arguments);
    }

    HSCRMContacts.prototype.model = Sidekick.Models.HSCRMContact;

    HSCRMContacts.prototype.url = null;

    return HSCRMContacts;

  })(Backbone.Collection);

  Sidekick.Models.SalesforceRecord = (function(_super) {
    __extends(SalesforceRecord, _super);

    function SalesforceRecord() {
      this.getSalesforceUrl = __bind(this.getSalesforceUrl, this);
      return SalesforceRecord.__super__.constructor.apply(this, arguments);
    }

    SalesforceRecord.prototype.initialize = function(data) {
      if (data.Company) {
        this.set('company_name', data.Company);
      }
      if (data.Name) {
        this.set('name', data.Name);
      }
      if (data.FirstName) {
        this.set('first_name', data.FirstName);
      }
      if (data.LastName) {
        this.set('last_name', data.LastName);
      }
      if (data.Title) {
        this.set('title', data.Title);
      }
      if (data.Email) {
        this.set('email', data.Email);
      }
      if (data.Phone) {
        this.set('phone_number', data.Phone);
      }
      if (data.Owner) {
        this.set('owner_name', data.Owner.Name);
        this.set('owned_by_queue', data.Owner.IsQueue);
      }
      if (data.Id) {
        this.set('id', data.Id);
        this.set('salesforce_id', data.Id);
      }
      if (data.LastActivityDate) {
        this.set('date', data.LastActivityDate.substring(0, 10));
      } else if (data.CreatedDate) {
        this.set('date', data.CreatedDate.substring(0, 10));
      }
    };

    SalesforceRecord.prototype.getSalesforceUrl = function() {
      return this.get('crm_base_url') + '/' + this.get('id');
    };

    return SalesforceRecord;

  })(Backbone.Model);

  Sidekick.Models.SalesforceLead = (function(_super) {
    __extends(SalesforceLead, _super);

    function SalesforceLead() {
      this.claimLead = __bind(this.claimLead, this);
      return SalesforceLead.__super__.constructor.apply(this, arguments);
    }

    SalesforceLead.prototype.initialize = function(data) {
      SalesforceLead.__super__.initialize.call(this, data);
      return this.set('record_type', 'lead');
    };

    SalesforceLead.prototype.claimLead = function(callback) {
      $.post("/contacts/salesforce/leads/claim.json", {
        'Id': this.get('salesforce_id')
      }, (function(_this) {
        return function(data, textStatus, jqXHR) {
          _this.set('claimed', true);
          return callback(data);
        };
      })(this), "json");
    };

    return SalesforceLead;

  })(Sidekick.Models.SalesforceRecord);

  Sidekick.Models.SalesforceOpportunity = (function(_super) {
    __extends(SalesforceOpportunity, _super);

    function SalesforceOpportunity() {
      return SalesforceOpportunity.__super__.constructor.apply(this, arguments);
    }

    SalesforceOpportunity.prototype.initialize = function(data) {
      SalesforceOpportunity.__super__.initialize.call(this, data);
      return this.set('record_type', 'opportunity');
    };

    return SalesforceOpportunity;

  })(Sidekick.Models.SalesforceRecord);

  Sidekick.Models.SalesforceAccount = (function(_super) {
    __extends(SalesforceAccount, _super);

    function SalesforceAccount() {
      return SalesforceAccount.__super__.constructor.apply(this, arguments);
    }

    SalesforceAccount.prototype.initialize = function(data) {
      SalesforceAccount.__super__.initialize.call(this, data);
      return this.set('record_type', 'account');
    };

    return SalesforceAccount;

  })(Sidekick.Models.SalesforceRecord);

  Sidekick.Models.SalesforceContact = (function(_super) {
    __extends(SalesforceContact, _super);

    function SalesforceContact() {
      return SalesforceContact.__super__.constructor.apply(this, arguments);
    }

    SalesforceContact.prototype.initialize = function(data) {
      SalesforceContact.__super__.initialize.call(this, data);
      return this.set('record_type', 'contact');
    };

    return SalesforceContact;

  })(Sidekick.Models.SalesforceRecord);

  Sidekick.Collections.SalesforceLeads = (function(_super) {
    __extends(SalesforceLeads, _super);

    function SalesforceLeads() {
      return SalesforceLeads.__super__.constructor.apply(this, arguments);
    }

    SalesforceLeads.prototype.model = Sidekick.Models.SalesforceLead;

    return SalesforceLeads;

  })(Backbone.Collection);

  Sidekick.Collections.SalesforceOpportunities = (function(_super) {
    __extends(SalesforceOpportunities, _super);

    function SalesforceOpportunities() {
      return SalesforceOpportunities.__super__.constructor.apply(this, arguments);
    }

    SalesforceOpportunities.prototype.model = Sidekick.Models.SalesforceOpportunity;

    return SalesforceOpportunities;

  })(Backbone.Collection);

  Sidekick.Collections.SalesforceAccounts = (function(_super) {
    __extends(SalesforceAccounts, _super);

    function SalesforceAccounts() {
      return SalesforceAccounts.__super__.constructor.apply(this, arguments);
    }

    SalesforceAccounts.prototype.model = Sidekick.Models.SalesforceAccount;

    return SalesforceAccounts;

  })(Backbone.Collection);

  Sidekick.Collections.SalesforceContacts = (function(_super) {
    __extends(SalesforceContacts, _super);

    function SalesforceContacts() {
      return SalesforceContacts.__super__.constructor.apply(this, arguments);
    }

    SalesforceContacts.prototype.model = Sidekick.Models.SalesforceContact;

    return SalesforceContacts;

  })(Backbone.Collection);

  Sidekick.Models.RecordSet = (function(_super) {
    __extends(RecordSet, _super);

    function RecordSet() {
      return RecordSet.__super__.constructor.apply(this, arguments);
    }

    RecordSet.prototype.defaults = {
      object_primary: null,
      object_secondary: null,
      object_tertiary: null,
      object_quaternary: null
    };

    RecordSet.prototype.initialize = function(data) {};

    return RecordSet;

  })(Backbone.Model);

  Sidekick.Models.SalesforceRecordSet = (function(_super) {
    __extends(SalesforceRecordSet, _super);

    function SalesforceRecordSet() {
      return SalesforceRecordSet.__super__.constructor.apply(this, arguments);
    }

    SalesforceRecordSet.prototype.defaults = {
      leads: new Sidekick.Collections.SalesforceLeads(),
      opportunities: new Sidekick.Collections.SalesforceOpportunities(),
      accounts: new Sidekick.Collections.SalesforceAccounts(),
      contacts: new Sidekick.Collections.SalesforceContacts()
    };

    SalesforceRecordSet.prototype.initialize = function(data) {
      this.set('record_set_type', 'Salesforce');
      this.set('salesforce_instance_url', data.salesforce_instance_url);
      this.get('leads').reset();
      this.get('opportunities').reset();
      this.get('accounts').reset();
      this.get('contacts').reset();
      this.set('object_primary', this.get('accounts'));
      this.set('object_secondary', this.get('opportunities'));
      this.set('object_tertiary', this.get('leads'));
      return this.set('object_quaternary', this.get('contacts'));
    };

    SalesforceRecordSet.prototype.addLead = function(lead_status_json) {
      var leads;
      lead_status_json.crm_base_url = this.get('salesforce_instance_url');
      leads = this.get('leads');
      leads.add(lead_status_json);
      this.set('leads', leads);
    };

    SalesforceRecordSet.prototype.addOpportunity = function(opportunity_status_json) {
      var opportunities;
      opportunity_status_json.crm_base_url = this.get('salesforce_instance_url');
      opportunities = this.get('opportunities');
      opportunities.add(opportunity_status_json);
      this.set('opportunities', opportunities);
    };

    SalesforceRecordSet.prototype.addAccount = function(account_status_json) {
      var accounts;
      account_status_json.crm_base_url = this.get('salesforce_instance_url');
      accounts = this.get('accounts');
      accounts.add(account_status_json);
      this.set('accounts', accounts);
    };

    SalesforceRecordSet.prototype.addContact = function(contact_status_json) {
      var contacts;
      contact_status_json.crm_base_url = this.get('salesforce_instance_url');
      contacts = this.get('contacts');
      contacts.add(contact_status_json);
      this.set('contacts', contacts);
    };

    return SalesforceRecordSet;

  })(Sidekick.Models.RecordSet);

  Sidekick.Models.HSCRMRecordSet = (function(_super) {
    __extends(HSCRMRecordSet, _super);

    function HSCRMRecordSet() {
      return HSCRMRecordSet.__super__.constructor.apply(this, arguments);
    }

    HSCRMRecordSet.prototype.initialize = function(data) {
      var companies, contacts, deals;
      this.set('record_set_type', 'HubSpot');
      companies = new Sidekick.Collections.HSCRMCompanies();
      deals = new Sidekick.Collections.HSCRMDeals();
      contacts = new Sidekick.Collections.HSCRMContacts();
      this.set('companies', companies);
      this.set('deals', deals);
      this.set('contacts', contacts);
      this.set('object_primary', this.get('companies'));
      this.set('object_secondary', this.get('deals'));
      this.set('object_tertiary', this.get('contacts'));
    };

    HSCRMRecordSet.prototype.addCompany = function(company_json) {
      var companies;
      companies = this.get('companies');
      companies.add(company_json);
      this.set('companies', companies);
    };

    HSCRMRecordSet.prototype.addDeal = function(deal_json) {
      var deals;
      deals = this.get('deals');
      deals.add(deal_json);
      this.set('deals', deals);
    };

    HSCRMRecordSet.prototype.addContact = function(contact_json) {
      var contacts;
      contacts = this.get('contacts');
      contacts.add(contact_json);
      this.set('contacts', contacts);
    };

    return HSCRMRecordSet;

  })(Sidekick.Models.RecordSet);

  Sidekick.Views.AddHubSpotRecordDetail = (function(_super) {
    __extends(AddHubSpotRecordDetail, _super);

    function AddHubSpotRecordDetail() {
      this.clickedCancel = __bind(this.clickedCancel, this);
      this.errorAddingLead = __bind(this.errorAddingLead, this);
      this.addedLead = __bind(this.addedLead, this);
      this.postRecord = __bind(this.postRecord, this);
      this.clickedSaveRecord = __bind(this.clickedSaveRecord, this);
      this.clickedRow = __bind(this.clickedRow, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.hide = __bind(this.hide, this);
      this.updateLeadStatus = __bind(this.updateLeadStatus, this);
      this.render = __bind(this.render, this);
      return AddHubSpotRecordDetail.__super__.constructor.apply(this, arguments);
    }

    AddHubSpotRecordDetail.prototype.className = 'edit-lead-detail';

    AddHubSpotRecordDetail.prototype.template = window.HAML["add_hubspot_record_detail_table"];

    AddHubSpotRecordDetail.prototype.events = {
      'click .data-row': 'clickedRow',
      'click a.save-record': 'clickedSaveRecord',
      'submit form.new-hubspot-record': 'postRecord',
      'click a.cancel': 'clickedCancel'
    };

    AddHubSpotRecordDetail.prototype.initialize = function(data) {
      this.type = data.type;
      this.model.listenTo(this.model, 'change', this.render);
      this.form_visible = false;
      this.data_table_visible = true;
      this.animating = false;
    };

    AddHubSpotRecordDetail.prototype.render = function() {
      var company_name, create_url, existing_records, valid_hidden_properties, valid_visible_properties, visible, _companies, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (this.animating) {
        return;
      }
      visible = false;
      if (this.$el.is(':visible') || this.form_visible) {
        visible = true;
      }
      if (this.type === "contact") {
        company_name = (_ref = this.model.get('company_object')) != null ? _ref.get('company_name') : void 0;
        if (!company_name) {
          company_name = this.model.get('company_name');
        }
        if (!company_name) {
          company_name = this.model.get('domain');
        }
        existing_records = this.model.get('existing_records');
        if (this.model.get('company_object')) {
          this.companies = (_ref1 = this.model.get('company_object')) != null ? (_ref2 = _ref1.get('existing_records')) != null ? _ref2.get('object_primary').toJSON() : void 0 : void 0;
        } else {
          _companies = (_ref3 = this.model.get('existing_records')) != null ? (_ref4 = _ref3.get('object_primary')) != null ? _ref4.toJSON() : void 0 : void 0;
          if (_companies && _companies.length > 0) {
            this.companies = _companies;
          }
        }
        if (!this.companies || this.companies.length < 1) {
          if (this.model.get('new_company_record')) {
            this.companies = [this.model.get('new_company_record')];
          }
        }
        create_url = "/insights/contacts/create.json";
        valid_hidden_properties = [
          {
            'property': 'hubspot_owner_id',
            'value': (_ref5 = window.app_config.get('hubspot_owner')) != null ? _ref5.ownerId : void 0
          }, {
            'property': 'city',
            'value': this.model.get('city')
          }, {
            'property': 'country',
            'value': this.model.get('country')
          }, {
            'property': 'address',
            'value': this.model.get('address')
          }, {
            'property': 'zip',
            'value': this.model.get('zipcode')
          }, {
            'property': 'state',
            'value': this.model.get('state')
          }, {
            'property': 'twitterhandle',
            'value': this.model.get('twitter_name')
          }
        ];
        valid_visible_properties = [
          {
            'property': 'firstname',
            'label': 'First Name',
            'value': this.model.get('first_name')
          }, {
            'property': 'lastname',
            'label': 'Last Name',
            'value': this.model.get('last_name')
          }, {
            'property': 'jobtitle',
            'label': 'Title',
            'value': this.model.get('title')
          }, {
            'property': 'website',
            'label': 'Website',
            'value': this.model.get('domain')
          }, {
            'property': 'email',
            'label': 'Email',
            'value': this.model.get('email')
          }, {
            'property': 'phone',
            'label': 'Phone',
            'value': this.model.get('phone_number')
          }
        ];
      } else {
        company_name = this.model.get('company_name');
        create_url = "/insights/companies/create.json";
        valid_hidden_properties = [
          {
            'property': 'hubspot_owner_id',
            'value': (_ref6 = window.app_config.get('hubspot_owner')) != null ? _ref6.ownerId : void 0
          }, {
            'property': 'city',
            'value': this.model.get('city')
          }, {
            'property': 'country',
            'value': this.model.get('country')
          }, {
            'property': 'address',
            'value': this.model.get('address')
          }, {
            'property': 'zip',
            'value': this.model.get('zipcode')
          }, {
            'property': 'state',
            'value': this.model.get('state')
          }, {
            'property': 'description',
            'value': this.model.get('overview')
          }, {
            'property': 'linkedin_company_page',
            'value': this.model.get('linkedin_url')
          }, {
            'property': 'facebook_company_page',
            'value': this.model.get('facebook_url')
          }, {
            'property': 'twitterhandle',
            'value': this.model.get('twitter_name')
          }, {
            'property': 'domain',
            'value': this.model.get('domain')
          }
        ];
        valid_visible_properties = [
          {
            'property': 'website',
            'label': 'Website',
            'value': this.model.get('domain')
          }, {
            'property': 'phone',
            'label': 'Phone',
            'value': this.model.get('phone_number')
          }
        ];
      }
      this.$el.html(this.template({
        statuses: this.model.get('hubspot_statuses'),
        lifecycle_stages: this.model.get('hubspot_lifecycle_stages'),
        hubspot_id: this.model.get('id'),
        company: company_name,
        email: this.model.get('email'),
        domain: this.model.get('domain'),
        companies: this.companies,
        create_url: create_url,
        type: this.type[0].toUpperCase() + this.type.slice(1),
        hscrm_error_message: this.model.get('hscrm_error_message'),
        valid_hidden_properties: valid_hidden_properties,
        valid_visible_properties: valid_visible_properties
      }));
      this.form_visible = true;
      $('input.data-field[prefilled]', this.$el).each(function() {
        return $(this).val($(this).attr('placeholder'));
      });
      if (!visible) {
        this.$el.hide();
      }
      if (!this.data_table_visible) {
        this.$('.data-table').hide();
      }
      this.updateLeadStatus();
      return this.$el;
    };

    AddHubSpotRecordDetail.prototype.updateLeadStatus = function() {
      if (this.model.get('status') === 'added-record') {
        this.$('a.save-record').hide();
        this.$('a.cancel').hide();
        this.$('a.button.view-in-crm').removeClass('hide');
        this.$('a.button.view-in-crm').attr('href', this.model.getHubspotUrl());
        this.$('a.button.view-in-crm').data('url', this.model.getHubspotUrl());
        this.$('a.banner.existing').attr('href', this.model.getHubspotUrl());
        this.$('a.banner.existing').data('url', this.model.getHubspotUrl());
      }
      if (this.model.get('status') === 'error-adding-lead') {
        this.$('a.save-record').hide();
        this.$('a.cancel').hide();
        return this.$('.notice.error').show();
      }
    };

    AddHubSpotRecordDetail.prototype.hide = function() {
      this.$el.hide();
    };

    AddHubSpotRecordDetail.prototype.scrollUp = function() {
      this.$el.slideUp();
    };

    AddHubSpotRecordDetail.prototype.scrollDown = function() {
      $('.highlight').removeClass('highlight');
      $('.edit-lead-detail').slideUp();
      if (this.$el.is(':hidden')) {
        this.$el.prev().addClass('highlight');
        this.$el.slideDown();
        this.render();
      }
    };

    AddHubSpotRecordDetail.prototype.clickedRow = function(event) {
      if (!$(event.target).hasClass('data-field')) {
        $(event.currentTarget).find('input.data-field').focus().select();
      }
    };

    AddHubSpotRecordDetail.prototype.clickedSaveRecord = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.add_lead_cta_state = 'adding';
      this.$('a.banner-button').addClass('adding');
      this.$('.save').hide();
      this.$('.adding-success').hide().delay(50).fadeIn();
      if (typeof console !== "undefined" && console !== null) {
        console.log(this.$('form.new-hubspot-record'));
      }
      this.$('form.new-hubspot-record').submit();
    };

    AddHubSpotRecordDetail.prototype.postRecord = function(e) {
      var company_id, company_object, detailView, i, prop, properties, _i, _len;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      detailView = this;
      properties = this.$('form.new-hubspot-record').serializeArray();
      if (this.type === "contact") {
        if (this.model.get('company_object')) {
          company_object = this.model.get('company_object');
        } else {
          company_object = this.model;
        }
        for (i = _i = 0, _len = properties.length; _i < _len; i = ++_i) {
          prop = properties[i];
          if (prop.name === "email" && prop.value.length < 1) {
            delete properties[i];
            if (typeof console !== "undefined" && console !== null) {
              console.log('deleting');
            }
          } else {
            prop.property = prop.name;
            if (this.companies && prop.name === "company") {
              if (prop.value === "NEW") {
                if (company_object.get('company_name')) {
                  prop.value = company_object.get('company_name');
                } else {
                  prop.value = company_object.get('domain');
                }
              } else {
                company_id = this.companies[prop.value]['company-id'];
                if (!company_id) {
                  company_id = this.companies[prop.value]['companyId'];
                }
                prop.value = this.companies[prop.value]['company_name'];
                properties.push({
                  'property': 'associatedcompanyid',
                  'value': company_id
                });
              }
            }
            delete prop.name;
          }
        }
      }
      properties = properties.filter(function() {
        return true;
      });
      if (typeof console !== "undefined" && console !== null) {
        console.debug(properties);
      }
      properties = JSON.stringify({
        "properties": properties
      });
      return $.post(this.$('form.new-hubspot-record').attr('action'), properties, function(data, textStatus, jqXHR) {
        if (data && 'status' in data && data['status'] === "error") {
          return detailView.errorAddingLead(data.message);
        } else if (data) {
          return detailView.addedLead(data);
        }
      });
    };

    AddHubSpotRecordDetail.prototype.addedLead = function(data) {
      if (this.type === "contact") {
        this.model.set('id', "contacts/" + data.vid);
      } else {
        this.model.set('id', "companies/" + data.companyId);
        this.model.set('hubspot_company_id', data.companyId);
        data.company_name = this.model.get('company_name');
        this.model.set('new_company_record', data);
      }
      this.model.set('status', 'added-record');
      this.data_table_visible = false;
      this.$('.data-table').slideUp();
    };

    AddHubSpotRecordDetail.prototype.errorAddingLead = function(error) {
      var error_message;
      error = $.parseJSON(error);
      console.error(error);
      error_message = error.msg;
      if (error.error === "CONTACT_EXISTS") {
        return this.addedLead(error.property);
      }
      this.model.set('hscrm_error_message', error_message);
      if (typeof console !== "undefined" && console !== null) {
        console.error("ERROR: [" + error_message + "]");
      }
      this.model.set('status', 'error-adding-lead');
      this.data_table_visible = false;
      return this.$('.data-table').slideUp();
    };

    AddHubSpotRecordDetail.prototype.clickedCancel = function() {
      this.scrollUp();
    };

    return AddHubSpotRecordDetail;

  })(Backbone.View);

  Sidekick.Views.AddLeadDetail = (function(_super) {
    __extends(AddLeadDetail, _super);

    function AddLeadDetail() {
      this.clickedCancel = __bind(this.clickedCancel, this);
      this.errorAddingLead = __bind(this.errorAddingLead, this);
      this.addedLead = __bind(this.addedLead, this);
      this.postRecord = __bind(this.postRecord, this);
      this.clickedSaveRecord = __bind(this.clickedSaveRecord, this);
      this.clickedRow = __bind(this.clickedRow, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.hide = __bind(this.hide, this);
      this.updateLeadStatus = __bind(this.updateLeadStatus, this);
      this.render = __bind(this.render, this);
      return AddLeadDetail.__super__.constructor.apply(this, arguments);
    }

    AddLeadDetail.prototype.className = 'edit-lead-detail';

    AddLeadDetail.prototype.template = window.HAML["add_lead_detail_table"];

    AddLeadDetail.prototype.events = {
      'click .data-row': 'clickedRow',
      'click a.save-record': 'clickedSaveRecord',
      'submit form.new-sfdc-lead': 'postRecord',
      'click a.cancel': 'clickedCancel'
    };

    AddLeadDetail.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change', this.render);
      this.form_visible = false;
      this.animating = false;
    };

    AddLeadDetail.prototype.render = function() {
      var visible;
      if (this.animating) {
        return;
      }
      visible = false;
      if (this.$el.is(':visible')) {
        visible = true;
      }
      this.$el.html(this.template({
        salesforce_id: this.model.get('salesforce_id'),
        input_statuses: this.model.get('add_lead_state'),
        first_name: this.model.get('first_name'),
        last_name: this.model.get('last_name'),
        title: this.model.get('title'),
        company: this.model.get('company_name'),
        phone: this.model.get('phone_number'),
        email: this.model.get('email'),
        overview: this.model.get('overview'),
        domain: this.model.get('domain'),
        state: this.model.get('state'),
        employees: this.model.get('employees'),
        salesforce_error_message: this.model.get('salesforce_error_message')
      }));
      $('input.data-field[prefilled]', this.$el).each(function() {
        return $(this).val($(this).attr('placeholder'));
      });
      if (!this.model.get('add_lead_state')) {
        this.$('a.banner-button').addClass('searching');
        this.$('a.banner-button.searching-status').show();
        this.$('a.banner-button.default').hide();
      }
      if (!visible) {
        this.$el.hide();
      }
      this.updateLeadStatus();
      return this.$el;
    };

    AddLeadDetail.prototype.updateLeadStatus = function() {
      if (this.model.get('status') === 'added-record') {
        this.$('a.save-record').hide();
        this.$('a.cancel').hide();
        this.$('.notice.success').show();
        this.$('a.existing-record-link').attr('href', this.model.get('salesforce_url'));
        this.$('a.existing-record-link').data('url', this.model.get('salesforce_url'));
        this.$('a.banner.existing').attr('href', this.model.get('salesforce_url'));
        this.$('a.banner.existing').data('url', this.model.get('salesforce_url'));
      }
      if (this.model.get('status') === 'error-adding-lead') {
        this.$('a.save-record').hide();
        this.$('a.cancel').hide();
        return this.$('.notice.error').show();
      }
    };

    AddLeadDetail.prototype.hide = function() {
      this.$el.hide();
    };

    AddLeadDetail.prototype.scrollUp = function() {
      this.$el.slideUp();
    };

    AddLeadDetail.prototype.scrollDown = function() {
      $('.highlight').removeClass('highlight');
      $('.edit-lead-detail').slideUp();
      if (this.$el.is(':hidden')) {
        this.$el.prev().addClass('highlight');
        this.$el.slideDown();
        this.render();
      }
    };

    AddLeadDetail.prototype.clickedRow = function(event) {
      if (!$(event.target).hasClass('data-field')) {
        $(event.currentTarget).find('input.data-field').focus().select();
      }
    };

    AddLeadDetail.prototype.clickedSaveRecord = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.add_lead_cta_state = 'adding';
      this.$('a.banner-button').addClass('adding');
      this.$('.save').hide();
      this.$('.adding-success').hide().delay(50).fadeIn();
      this.postRecord();
    };

    AddLeadDetail.prototype.postRecord = function(e) {
      var detailView;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      detailView = this;
      return $.post(this.$('form.new-sfdc-lead').attr('action'), this.$('form.new-sfdc-lead').serialize(), function(data, textStatus, jqXHR) {
        if (typeof console !== "undefined" && console !== null) {
          console.log(data);
        }
        if ('error' in data) {
          return detailView.errorAddingLead(data.error);
        } else {
          return detailView.addedLead(data.lead_url);
        }
      });
    };

    AddLeadDetail.prototype.addedLead = function(salesforce_url) {
      this.model.set('salesforce_url', salesforce_url);
      this.model.set('status', 'added-record');
      this.$('.data-table').slideUp();
    };

    AddLeadDetail.prototype.errorAddingLead = function(error) {
      var error_message;
      error_message = $.parseJSON(error);
      this.model.set('salesforce_error_message', error_message[0].message);
      if (typeof console !== "undefined" && console !== null) {
        console.error("ERROR: [" + error_message[0].message + "]");
      }
      this.model.set('status', 'error-adding-lead');
      return this.$('.data-table').slideUp();
    };

    AddLeadDetail.prototype.clickedCancel = function() {
      this.scrollUp();
    };

    return AddLeadDetail;

  })(Backbone.View);

  Sidekick.Views.App = (function(_super) {
    __extends(App, _super);

    function App() {
      this.clickedViewContact = __bind(this.clickedViewContact, this);
      this.updateAppConfig = __bind(this.updateAppConfig, this);
      this.newContact = __bind(this.newContact, this);
      this.refreshSidekick = __bind(this.refreshSidekick, this);
      this.closeSidekick = __bind(this.closeSidekick, this);
      this.refresh = __bind(this.refresh, this);
      this.homeView = __bind(this.homeView, this);
      this.changeLeadView = __bind(this.changeLeadView, this);
      this.render = __bind(this.render, this);
      this.initMessageListener = __bind(this.initMessageListener, this);
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.el = 'body';

    App.prototype.events = {
      'click .back-container': 'previousLeadView',
      'click a.close-sidekick-btn': 'closeSidekick',
      'click a.home-sidekick-btn': 'refreshSidekick',
      'click .signals-activity a.view-contact-action': 'clickedViewContact'
    };

    App.prototype.initialize = function(data) {
      this.lead_view = new Sidekick.Views.LeadView({
        model: data.model
      });
      this.render();
      this.user_model = new Sidekick.Models.Contact({
        email: window.app_config.get('email'),
        name: null
      });
      window.sendMsg('getStream');
      if (window.app_config.get('is_user_profile')) {
        window.sendMsg('insightsLoaded', {
          'stream_loaded': true
        });
      } else {
        window.sendMsg('insightsLoaded', {
          'contact_loaded': true
        });
      }
      this.initMessageListener();
    };

    App.prototype.initMessageListener = function() {
      window.addEventListener("message", ((function(_this) {
        return function(event) {
          if (event.data.newContact != null) {
            window.resetTrackStats();
            _this.changeLeadView(_this.newContact(event.data.newContact), true, false);
            window.sendMsg('insightsLoaded', {
              'contact_loaded': true
            });
          }
          if (event.data.viewStream != null) {
            window.resetTrackStats();
            _this.changeLeadView(_this.homeView(), true, true);
            window.sendMsg('insightsLoaded', {
              'stream_loaded': true
            });
          }
          if (event.data.stream != null) {
            if (window.app_config.get('is_user_profile')) {
              _this.lead_view.model.set('activities', _this.model.formatActivityData({
                "activities": event.data.stream
              }));
            }
          }
          if (event.data.rapportiveData != null) {
            console.debug("Rapportive Data");
            console.debug(event.data);
          }
          if (event.data === 'updateStream') {
            return _this.lead_view.model.retrieveStreamData();
          }
        };
      })(this)));
    };

    App.prototype.render = function() {
      this.$el.append(this.lead_view.render());
      return this.$el;
    };

    App.prototype.changeLeadView = function(lead, is_contact, is_user_profile) {
      if (is_contact == null) {
        is_contact = false;
      }
      if (is_user_profile == null) {
        is_user_profile = false;
      }
      window.resetTrackStats();
      window.app_config.set('is_contact', is_contact);
      window.app_config.set('is_user_profile', is_user_profile);
      if (window.app_config.get('is_gmail') === true) {
        window.track_stats.insights_open = true;
      }
      this.lead_view.unattach();
      this.lead_view = new Sidekick.Views.LeadView({
        model: lead
      });
      this.refresh();
    };

    App.prototype.homeView = function() {
      this.updateAppConfig({
        email: window.app_config.get('email')
      });
      this.user_model.retrieveStreamData();
      return this.user_model;
    };

    App.prototype.refresh = function() {
      this.$el.append(this.lead_view.render().hide().fadeIn('fast'));
    };

    App.prototype.closeSidekick = function() {
      window.sendMsg('closeSidekick');
    };

    App.prototype.refreshSidekick = function() {
      this.changeLeadView(this.homeView(), true, true);
    };

    App.prototype.newContact = function(data) {
      var lead, new_contact;
      if (data.email === 'user' || data.email === window.app_config.get('email') || data.email === null) {
        return this.homeView();
      }
      this.updateAppConfig(data);
      new_contact = {
        email: data.email,
        name: data.name
      };
      lead = new Sidekick.Models.Contact(new_contact);
      return lead;
    };

    App.prototype.updateAppConfig = function(data) {
      window.app_config.set('is_contact', data.email !== window.app_config.get('email'));
      return window.app_config.set('is_user_profile', data.email === window.app_config.get('email'));
    };

    App.prototype.clickedViewContact = function(e) {
      var $clicked_contact, data;
      $clicked_contact = $(e.currentTarget);
      data = {
        email: $clicked_contact.data('email'),
        name: $clicked_contact.data('name')
      };
      if (data.email) {
        window.resetTrackStats();
        window.app_config.set('is_contact', true);
        this.changeLeadView(this.newContact(data), true, false);
      }
    };

    return App;

  })(Backbone.View);

  Sidekick.Views.Back = (function(_super) {
    __extends(Back, _super);

    function Back() {
      this.slideDown = __bind(this.slideDown, this);
      this.slideUp = __bind(this.slideUp, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      return Back.__super__.constructor.apply(this, arguments);
    }

    Back.prototype.className = 'back-container';

    Back.prototype.template = window.HAML["back_container"];

    Back.prototype.initialize = function(data) {
      this.previous_domain = '';
    };

    Back.prototype.render = function(update) {
      if (update == null) {
        update = false;
      }
      this.$el.html(this.template({
        previous_domain: this.previous_domain
      }));
      if (!update) {
        this.$el.hide();
      }
      return this.$el;
    };

    Back.prototype.update = function(data) {
      this.previous_domain = data;
      return this.render(true);
    };

    Back.prototype.slideUp = function() {
      return this.$el.slideUp('fast');
    };

    Back.prototype.slideDown = function() {
      return this.$el.slideDown('fast');
    };

    return Back;

  })(Backbone.View);

  Sidekick.Views.Banner = (function(_super) {
    __extends(Banner, _super);

    function Banner() {
      this.updateLeadStatus = __bind(this.updateLeadStatus, this);
      this.render = __bind(this.render, this);
      return Banner.__super__.constructor.apply(this, arguments);
    }

    Banner.prototype.className = 'banner-container';

    Banner.prototype.template = window.HAML["banner_container"];

    Banner.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:status', this.updateLeadStatus);
    };

    Banner.prototype.render = function() {
      this.$el.html(this.template());
      return this.$el;
    };

    Banner.prototype.updateLeadStatus = function() {
      this.$('a.banner-button').hide();
      if (this.model.get('status') === 'existing-lead') {
        this.$('a.banner-button.existing').slideDown('slow');
      }
      return this.$('a.banner.existing').attr('href', this.model.get('salesforce_url'));
    };

    return Banner;

  })(Backbone.View);

  Sidekick.Views.CompanyConnectionsTable = (function(_super) {
    __extends(CompanyConnectionsTable, _super);

    function CompanyConnectionsTable() {
      this.updateCompanyConnectionModels = __bind(this.updateCompanyConnectionModels, this);
      this.clickedAddContact = __bind(this.clickedAddContact, this);
      this.clickedRevealEmail = __bind(this.clickedRevealEmail, this);
      this.clickedSaveRecord = __bind(this.clickedSaveRecord, this);
      this.clickedExpand = __bind(this.clickedExpand, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.render = __bind(this.render, this);
      return CompanyConnectionsTable.__super__.constructor.apply(this, arguments);
    }

    CompanyConnectionsTable.prototype.className = 'company-connections-table';

    CompanyConnectionsTable.prototype.template = window.HAML["company_connections_table"];

    CompanyConnectionsTable.prototype.events = {
      'click .link-list-header a.expand-link': 'clickedExpand',
      'click .company-contact a.add-contact-link': 'clickedAddContact',
      'click .company-connections-list a.save-record': 'clickedSaveRecord',
      'click .company-contact a.email-action': 'clickedRevealEmail'
    };

    CompanyConnectionsTable.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:company_name', this.render);
      this.model.listenTo(this.model, 'change:company_connections', this.render);
      this.company_connection_models = [];
      this.limited = true;
    };

    CompanyConnectionsTable.prototype.render = function() {
      var company_connections, domain, limit;
      company_connections = this.model.get('company_connections');
      domain = this.model.get('domain');
      if (company_connections === 'none' || company_connections === null) {
        company_connections = [];
      }
      if (this.limited) {
        limit = 6;
      } else {
        limit = 1000;
      }
      this.$el.html(this.template({
        company_connections: company_connections,
        domain: domain,
        company_name: this.model.get('company_name'),
        limited: this.limited,
        limit: limit,
        has_salesforce: window.app_config.get('has_salesforce'),
        inbox_connected: window.app_config.get('has_inbox_connected')
      }));
      $(".company-connections-list", this.$el).show();
      if (company_connections && company_connections.length > 0) {
        $(".view-company-connections", this.$el).fadeIn('fast');
      }
      this.$('.tippable').tooltip();
      return this.$el;
    };

    CompanyConnectionsTable.prototype.scrollDown = function() {
      $(".company-connections-list", this.$el).slideDown();
      this.$el.addClass('visible');
    };

    CompanyConnectionsTable.prototype.scrollUp = function() {
      $(".company-connections-list", this.$el).slideUp();
      this.$el.removeClass('visible');
    };

    CompanyConnectionsTable.prototype.clickedExpand = function() {
      this.limited = !this.limited;
      this.render();
    };

    CompanyConnectionsTable.prototype.clickedSaveRecord = function(event) {
      var $connection;
      $connection = $(event.currentTarget).parents('.edit-lead-detail').prev('.company-contact');
      $connection.addClass('saving-record');
    };

    CompanyConnectionsTable.prototype.clickedRevealEmail = function(event) {
      var $contact, connections, contact, id;
      event.preventDefault();
      $contact = $(event.currentTarget).parents('.company-contact');
      id = parseInt($contact.data('index'));
      connections = this.model.get('company_connections');
      contact = connections[id];
      if (window.app_config.get('is_gmail')) {
        window.sendMsg('emailGmail', {
          email: contact.email
        });
      } else {
        window.open("mailto:" + contact.email);
      }
    };

    CompanyConnectionsTable.prototype.clickedAddContact = function(event) {
      var $contact, addCRMDetailTable, contact_model, id;
      event.preventDefault();
      $contact = $(event.currentTarget).parents('.company-contact');
      id = parseInt($contact.data('index'));
      this.$('.edit-lead-detail').slideUp();
      if (!$contact.hasClass('highlight')) {
        this.$('.company-contact').removeClass('highlight');
        contact_model = this.model.clone();
        contact_model.setConnectionAsLead(id);
        this.company_connection_models.push(contact_model);
        this.model.listenTo(this.model, 'change:add_lead_state', this.updateCompanyConnectionModels);
        if (window.app_config.get('has_hubspot')) {
          addCRMDetailTable = new Sidekick.Views.AddHubSpotRecordDetail({
            model: contact_model,
            type: "contact"
          });
        } else {
          addCRMDetailTable = new Sidekick.Views.AddLeadDetail({
            model: contact_model
          });
        }
        $contact.after(addCRMDetailTable.render().hide());
        addCRMDetailTable.scrollDown();
      } else {
        this.$('.company-contact').removeClass('highlight');
      }
    };

    CompanyConnectionsTable.prototype.updateCompanyConnectionModels = function() {
      var company_connection_model, _i, _len, _ref, _results;
      _ref = this.company_connection_models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        company_connection_model = _ref[_i];
        _results.push(company_connection_model.set('add_lead_state', this.model.get('add_lead_state')));
      }
      return _results;
    };

    return CompanyConnectionsTable;

  })(Backbone.View);

  Sidekick.Views.CompanyContactsTable = (function(_super) {
    __extends(CompanyContactsTable, _super);

    function CompanyContactsTable() {
      this.updateCompanyContactModels = __bind(this.updateCompanyContactModels, this);
      this.clickedAddContact = __bind(this.clickedAddContact, this);
      this.clickedGuessEmail = __bind(this.clickedGuessEmail, this);
      this.getContactDataFromTarget = __bind(this.getContactDataFromTarget, this);
      this.clickedSaveRecord = __bind(this.clickedSaveRecord, this);
      this.clickedExpand = __bind(this.clickedExpand, this);
      this.searchName = __bind(this.searchName, this);
      this.searchRole = __bind(this.searchRole, this);
      this.filteredContacts = __bind(this.filteredContacts, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.render = __bind(this.render, this);
      return CompanyContactsTable.__super__.constructor.apply(this, arguments);
    }

    CompanyContactsTable.prototype.className = 'company-contacts-table';

    CompanyContactsTable.prototype.template = window.HAML["company_contacts_table"];

    CompanyContactsTable.prototype.events = {
      'click .link-list-header a.expand-link': 'clickedExpand',
      'click .company-contact a.add-contact-link': 'clickedAddContact',
      'click .company-contact a.email-action': 'clickedGuessEmail',
      'click .company-contacts-list a.save-record': 'clickedSaveRecord',
      'change select.filter-type': 'filteredContacts',
      'click .search-role-button': 'searchRole',
      'click .search-name-button': 'searchName',
      'keyup .name-search-term': 'searchName'
    };

    CompanyContactsTable.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:company_contacts', this.render);
      this.model.listenTo(this.model, 'change:can_add_leads', this.render);
      this.company_contact_models = [];
      this.limited = true;
      this.small_company = false;
      this.role = '';
    };

    CompanyContactsTable.prototype.render = function() {
      var can_add_leads, company_contacts, domain, has_salesforce, initial_role, limit, search_container_visible;
      company_contacts = this.model.get('company_contacts');
      domain = this.model.get('domain');
      search_container_visible = false;
      if (this.$('.search-container').css('display') !== 'none') {
        search_container_visible = true;
      }
      if ((typeof company_contacts === "object") && company_contacts) {
        if (this.role === '' || this.role === 'CUSTOM') {
          if (company_contacts['NONE'] && company_contacts['NONE'].length > 0) {
            this.small_company = true;
            if (company_contacts['NONE'].length > 0) {
              company_contacts = company_contacts['NONE'];
            } else {
              company_contacts = [];
            }
          } else {
            this.limited = true;
            if (company_contacts['EXECUTIVE'] && company_contacts['EXECUTIVE'].length > 0) {
              initial_role = 'EXECUTIVE';
            } else {
              initial_role = Object.keys(company_contacts)[0];
              if (this.role === '') {
                this.role = initial_role;
              }
            }
            company_contacts = company_contacts[initial_role];
          }
        } else {
          if (this.role === 'SEARCH') {
            this.role = 'CUSTOM';
          }
          this.limited = false;
          company_contacts = company_contacts[this.role];
        }
      }
      if (this.limited) {
        limit = 6;
      } else {
        limit = 1000;
      }
      if (company_contacts === 'none' || company_contacts === null) {
        company_contacts = [];
        this.small_company = true;
      }
      if (this.model.get('can_add_leads') == null) {
        if (window.localStorage['can_add_leads'] != null) {
          can_add_leads = window.localStorage['can_add_leads'] === "true";
        } else {
          can_add_leads = false;
        }
      } else {
        can_add_leads = this.model.get('can_add_leads');
      }
      has_salesforce = window.app_config.get('has_salesforce') === true && (can_add_leads === true);
      this.$el.html(this.template({
        all_company_contacts: this.model.get('company_contacts'),
        department_buckets: this.model.get('DEPARTMENT_BUCKETS'),
        company_contacts: company_contacts,
        domain: domain,
        limited: this.limited,
        limit: limit,
        has_avatars: false,
        small_company: this.small_company,
        company_name: this.model.get('company_name'),
        role: this.role,
        has_salesforce: has_salesforce,
        has_insights_plus: window.app_config.get('has_insights_plus'),
        has_hubspot: window.app_config.get('has_hubspot')
      }));
      if (search_container_visible) {
        if (this.role !== "CUSTOM") {
          this.$('.search-container').show().slideUp();
        }
      }
      if (this.role === "CUSTOM") {
        if (search_container_visible) {
          this.$('.search-container').show();
        } else {
          this.$('.search-container').slideDown();
        }
      }
      $(".company-contacts-list", this.$el).show();
      if (company_contacts && company_contacts.length > 0) {
        $(".view-company-contacts", this.$el).fadeIn('fast');
      }
      this.$('.tippable').tooltip();
      return this.$el;
    };

    CompanyContactsTable.prototype.scrollDown = function() {
      $(".company-contacts-list", this.$el).slideDown();
      this.$el.addClass('visible');
    };

    CompanyContactsTable.prototype.scrollUp = function() {
      $(".company-contacts-list", this.$el).slideUp();
      this.$el.removeClass('visible');
    };

    CompanyContactsTable.prototype.filteredContacts = function(event) {
      this.role = this.$('select.filter-type').val();
      this.render();
    };

    CompanyContactsTable.prototype.searchRole = function(event) {
      var query, role;
      this.role = "SEARCH";
      query = this.$('.role-search-term').val();
      this.model.retrieveCompanyContacts(role = query);
    };

    CompanyContactsTable.prototype.searchName = function(event) {
      var fullname, name, query, role;
      if (event.keyCode && event.keyCode !== 13) {
        return;
      }
      query = this.$('.name-search-term').val();
      if (this.small_company) {
        role = 'NONE';
      } else {
        if (this.role === '') {
          role = "EXECUTIVE";
        } else {
          role = this.role;
        }
      }
      name = query.split(' ');
      fullname = name[0][0].toUpperCase() + name[0].slice(1).toLowerCase() + ' ' + name[1][0].toUpperCase() + name[1].slice(1).toLowerCase();
      this.model.addContact(fullname = fullname, role = role);
    };

    CompanyContactsTable.prototype.clickedExpand = function() {
      this.limited = !this.limited;
      this.render();
    };

    CompanyContactsTable.prototype.clickedSaveRecord = function(event) {
      var $contact;
      $contact = $(event.currentTarget).parents('.edit-lead-detail').prev('.company-contact');
      $contact.addClass('saving-record');
    };

    CompanyContactsTable.prototype.getContactDataFromTarget = function(event) {
      var $contact, id, role;
      $contact = $(event.currentTarget).parents('.company-contact');
      id = parseInt($contact.data('index'));
      if (this.small_company) {
        role = 'NONE';
      } else {
        this.role = this.$('select.filter-type').val();
        if (this.role === '') {
          role = "EXECUTIVE";
        } else {
          role = this.role;
        }
      }
      return {
        role: role,
        id: id
      };
    };

    CompanyContactsTable.prototype.clickedGuessEmail = function(event) {
      var id, role, _ref;
      event.preventDefault();
      _ref = this.getContactDataFromTarget(event), role = _ref.role, id = _ref.id;
      this.model.guessContactEmail(role, id);
    };

    CompanyContactsTable.prototype.clickedAddContact = function(event) {
      var $contact, addCRMDetailTable, contact_model, id, role, _ref;
      event.preventDefault();
      $contact = $(event.currentTarget).parents('.company-contact');
      _ref = this.getContactDataFromTarget(event), role = _ref.role, id = _ref.id;
      this.$('.edit-lead-detail').slideUp();
      if (!$contact.hasClass('highlight')) {
        this.$('.company-contact').removeClass('highlight');
        contact_model = this.model.clone();
        contact_model.setContactAsLead(role, id);
        this.company_contact_models.push(contact_model);
        this.model.listenTo(this.model, 'change:add_lead_state', this.updateCompanyContactModels);
        if (window.app_config.get('has_hubspot')) {
          addCRMDetailTable = new Sidekick.Views.AddHubSpotRecordDetail({
            model: contact_model,
            type: "contact"
          });
        } else {
          addCRMDetailTable = new Sidekick.Views.AddLeadDetail({
            model: contact_model
          });
        }
        $contact.after(addCRMDetailTable.render().hide());
        addCRMDetailTable.scrollDown();
      } else {
        this.$('.company-contact').removeClass('highlight');
      }
    };

    CompanyContactsTable.prototype.updateCompanyContactModels = function() {
      var company_contact_model, _i, _len, _ref, _results;
      _ref = this.company_contact_models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        company_contact_model = _ref[_i];
        _results.push(company_contact_model.set('add_lead_state', this.model.get('add_lead_state')));
      }
      return _results;
    };

    return CompanyContactsTable;

  })(Backbone.View);

  Sidekick.Views.DataTable = (function(_super) {
    __extends(DataTable, _super);

    function DataTable() {
      this.clickedSaveRecord = __bind(this.clickedSaveRecord, this);
      this.clickedShowMore = __bind(this.clickedShowMore, this);
      this.clickedCancelAddLead = __bind(this.clickedCancelAddLead, this);
      this.clickedAddLead = __bind(this.clickedAddLead, this);
      this.expandedItem = __bind(this.expandedItem, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      return DataTable.__super__.constructor.apply(this, arguments);
    }

    DataTable.prototype.className = 'data-table';

    DataTable.prototype.template = window.HAML["data_table"];

    DataTable.prototype.events = {
      'click .expandable': 'expandedItem',
      'click a.banner-button.add-to-crm': 'clickedAddLead',
      'click a.cancel': 'clickedCancelAddLead',
      'click a.show-more': 'clickedShowMore',
      'click a.save-record': 'clickedSaveRecord'
    };

    DataTable.prototype.defaults = {
      rendered: false
    };

    DataTable.prototype.initialize = function(data) {};

    DataTable.prototype.render = function(data) {
      var can_add_leads;
      if (!this.rendered) {
        this.rendered = true;
        this.$el.html(this.template(data));
        this.$('.crm-controls').hide();
        this.$('.link-list').after(this.addCRMDetailTable.render());
        if (this.model.get('can_add_leads') == null) {
          if (window.localStorage['can_add_leads'] != null) {
            can_add_leads = window.localStorage['can_add_leads'] === "true";
          } else {
            can_add_leads = false;
          }
        } else {
          can_add_leads = this.model.get('can_add_leads');
        }
        if ((!(window.app_config.get('has_salesforce') === true && (can_add_leads === true))) && !(window.app_config.get('has_hubspot'))) {
          this.$el.addClass('no-salesforce');
        } else {
          this.$el.removeClass('no-salesforce');
        }
      }
      this.update(data);
      return this.$el;
    };

    DataTable.prototype.update = function(data) {
      var detailed_data_visible, overview_visible, _ref, _ref1;
      if (data != null ? data.visible_properties : void 0) {
        this.$('.visible-properties').html(window.HAML["visible_properties"](data));
      }
      if (data != null ? data.has_hidden_properties : void 0) {
        detailed_data_visible = false;
        if (this.$('.detailed-data').is(':visible')) {
          detailed_data_visible = true;
        }
        this.$('.hidden-properties').html(window.HAML["hidden_properties"](data));
        if (!detailed_data_visible) {
          this.$('.detailed-data').hide();
        } else {
          this.$('.show-more-row').hide();
        }
      }
      if (data != null ? data.has_social_properties : void 0) {
        this.$('.social-properties').html(window.HAML["social_properties"](data));
      }
      if ((_ref = this.$('.overview a.lead-overview')) != null ? _ref.hasClass('expanded') : void 0) {
        overview_visible = true;
      }
      if (((data != null ? data.overview : void 0) != null) && data.overview !== "None" && data.overview !== "") {
        this.$('.overview').html(window.HAML["overview"](data));
        if (overview_visible) {
          if ((_ref1 = this.$('.overview a.lead-overview')) != null) {
            _ref1.addClass('expanded');
          }
        }
      }
      if (((data != null ? data.is_existing_record : void 0) != null) || ((data != null ? data.is_not_existing_record : void 0) != null)) {
        if (data.is_existing_record) {
          this.$('a.add-to-crm').addClass('hide');
          this.$('a.view-in-crm').attr('href', data.existing_record);
          this.$('a.view-in-crm').removeClass('hide');
          this.$('.crm-controls').fadeIn();
        } else if (data.is_not_existing_record || (data.has_salesforce && !data.has_hubspot)) {
          this.$('a.view-in-crm').addClass('hide');
          this.$('a.add-to-crm').removeClass('hide');
          this.$('.crm-controls').fadeIn();
        }
      }
    };

    DataTable.prototype.scrollUp = function() {
      this.$el.addClass('hidden');
      this.$el.slideUp();
    };

    DataTable.prototype.scrollDown = function() {
      this.$el.slideDown();
    };

    DataTable.prototype.expandedItem = function(e) {
      $(e.currentTarget).toggleClass('expanded');
    };

    DataTable.prototype.clickedAddLead = function() {
      this.$('a.button.add-to-crm').fadeOut();
      this.addCRMDetailTable.scrollDown();
    };

    DataTable.prototype.clickedCancelAddLead = function() {
      this.$('a.button.add-to-crm').fadeIn();
      this.addCRMDetailTable.clickedCancel();
    };

    DataTable.prototype.clickedShowMore = function() {
      this.$('.show-more-row').slideUp();
      this.$('.detailed-data').slideDown();
    };

    DataTable.prototype.clickedSaveRecord = function() {
      this.addCRMDetailTable.clickedSaveRecord();
    };

    return DataTable;

  })(Backbone.View);

  Sidekick.Views.CompanyDataTable = (function(_super) {
    __extends(CompanyDataTable, _super);

    function CompanyDataTable() {
      this.render = __bind(this.render, this);
      this.update = __bind(this.update, this);
      this.refreshProperties = __bind(this.refreshProperties, this);
      this.updateTime = __bind(this.updateTime, this);
      return CompanyDataTable.__super__.constructor.apply(this, arguments);
    }

    CompanyDataTable.prototype.initialize = function(data) {
      CompanyDataTable.__super__.initialize.call(this, data);
      this.model.listenTo(this.model, 'change:revenue', this.update);
      this.model.listenTo(this.model, 'change:employees', this.update);
      this.model.listenTo(this.model, 'change:state', this.update);
      this.model.listenTo(this.model, 'change:existing_records', this.update);
      this.model.listenTo(this.model, 'change:overview', this.update);
      this.model.listenTo(this.model, 'change:local_time', this.updateTime);
      this.model.listenTo(this.model, 'change:can_add_leads', this.update);
      this.model.listenTo(this.model, 'change:last_touch_date', this.update);
      if (window.app_config.get('has_hubspot')) {
        this.addCRMDetailTable = new Sidekick.Views.AddHubSpotRecordDetail({
          model: this.model,
          type: "company"
        });
      } else {
        this.addCRMDetailTable = new Sidekick.Views.AddLeadDetail({
          model: this.model
        });
      }
    };

    CompanyDataTable.prototype.updateTime = function() {
      this.$('.data-row[data-row-type="Local Time"] .data-col-value').text(this.model.get('local_time'));
    };

    CompanyDataTable.prototype.refreshProperties = function() {
      var headquarters;
      headquarters = null;
      if (this.model.get('state') && this.model.get('state') !== "null") {
        headquarters = "" + (this.model.get('state')) + ", " + (this.model.get('country'));
      } else if (this.model.get('country') && this.model.get('country') !== 'null') {
        headquarters = this.model.get('country');
      }
      this.visible_properties = [
        {
          'label': 'Employees',
          'value': this.model.get('employees')
        }, {
          'label': 'Revenue',
          'value': this.model.get('revenue')
        }, {
          'label': 'Headquarters',
          'value': headquarters
        }, {
          'label': 'Local Time',
          'value': this.model.get('local_time')
        }, {
          'label': 'Founded',
          'value': this.model.get('founded')
        }, {
          'label': 'Last Contacted',
          'value': this.model.get('last_touch_date')
        }
      ];
      this.hidden_properties = [
        {
          'label': 'Facebook',
          'value': this.model.get('company_name'),
          'link': this.model.get('facebook_url'),
          'rawvalue': this.model.get('facebook_url')
        }, {
          'label': 'Twitter',
          'value': "@" + (this.model.get('twitter_name')),
          'link': "http://twitter.com/" + (this.model.get('twitter_name')),
          'rawvalue': this.model.get('twitter_name')
        }, {
          'label': 'Blog',
          'value': "" + (this.model.get('company_name')) + " Blog",
          'link': this.model.get('blog_url'),
          'rawvalue': this.model.get('blog_url')
        }, {
          'label': 'Phone',
          'value': this.model.get('phone_number')
        }, {
          'label': 'Address',
          'value': this.model.get('address1')
        }, {
          'label': '&nbsp;',
          'value': this.model.get('address2')
        }, {
          'label': 'ZIP/Postal',
          'value': this.model.get('zipcode')
        }, {
          'label': 'City',
          'value': this.model.get('city')
        }, {
          'label': 'Country',
          'value': this.model.get('country')
        }
      ];
      this.has_hidden_properties = this.model.get('country') || this.model.get('city') || this.model.get('zipcode') || this.model.get('address1') || this.model.get('twitter_name') || this.model.get('facebook_url') || this.model.get('blog_url') || this.model.get('phone_number');
    };

    CompanyDataTable.prototype.update = function() {
      var data, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      this.refreshProperties();
      data = {
        visible_properties: this.visible_properties,
        hidden_properties: this.hidden_properties,
        has_hidden_properties: this.has_hidden_properties,
        company_name: this.model.get('company_name'),
        overview: this.model.get('overview'),
        has_salesforce: window.app_config.get('has_salesforce'),
        has_hubspot: window.app_config.get('has_hubspot'),
        existing_record: (_ref = this.model.get('existing_records')) != null ? (_ref1 = _ref.get('companies')) != null ? (_ref2 = _ref1.first()) != null ? _ref2.getHubspotUrl() : void 0 : void 0 : void 0,
        is_existing_record: ((_ref3 = this.model.get('existing_records')) != null ? (_ref4 = _ref3.get('companies')) != null ? _ref4.length : void 0 : void 0) > 0,
        is_not_existing_record: ((_ref5 = this.model.get('existing_records')) != null ? (_ref6 = _ref5.get('companies')) != null ? _ref6.length : void 0 : void 0) === 0
      };
      return CompanyDataTable.__super__.update.call(this, data);
    };

    CompanyDataTable.prototype.render = function() {
      var data, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      this.refreshProperties();
      data = {
        visible_properties: this.visible_properties,
        hidden_properties: this.hidden_properties,
        has_hidden_properties: this.has_hidden_properties,
        company_name: this.model.get('company_name'),
        overview: this.model.get('overview'),
        has_salesforce: window.app_config.get('has_salesforce'),
        has_hubspot: window.app_config.get('has_hubspot'),
        existing_record: (_ref = this.model.get('existing_records')) != null ? (_ref1 = _ref.get('companies')) != null ? (_ref2 = _ref1.first()) != null ? _ref2.getHubspotUrl() : void 0 : void 0 : void 0,
        is_existing_record: ((_ref3 = this.model.get('existing_records')) != null ? (_ref4 = _ref3.get('companies')) != null ? _ref4.length : void 0 : void 0) > 0,
        is_not_existing_record: ((_ref5 = this.model.get('existing_records')) != null ? (_ref6 = _ref5.get('companies')) != null ? _ref6.length : void 0 : void 0) === 0
      };
      return CompanyDataTable.__super__.render.call(this, data);
    };

    return CompanyDataTable;

  })(Sidekick.Views.DataTable);

  Sidekick.Views.ContactDataTable = (function(_super) {
    __extends(ContactDataTable, _super);

    function ContactDataTable() {
      this.render = __bind(this.render, this);
      this.update = __bind(this.update, this);
      this.refreshProperties = __bind(this.refreshProperties, this);
      return ContactDataTable.__super__.constructor.apply(this, arguments);
    }

    ContactDataTable.prototype.initialize = function(data) {
      ContactDataTable.__super__.initialize.call(this, data);
      this.model.listenTo(this.model, 'change', this.update);
      if (this.model.get('company_object')) {
        this.model.listenTo(this.model.get('company_object'), 'change:existing_records', this.update);
      }
      if (window.app_config.get('has_hubspot')) {
        this.addCRMDetailTable = new Sidekick.Views.AddHubSpotRecordDetail({
          model: this.model,
          type: "contact"
        });
      } else {
        this.addCRMDetailTable = new Sidekick.Views.AddLeadDetail({
          model: this.model
        });
      }
    };

    ContactDataTable.prototype.refreshProperties = function() {
      var query_model, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      this.visible_properties = [
        {
          'label': 'Last Contacted',
          'value': this.model.get('last_touch_date')
        }
      ];
      this.hidden_properties = [];
      this.social_properties = [];
      this.has_hidden_properties = this.hidden_properties.some(function(v) {
        return v.rawvalue;
      });
      this.has_social_properties = this.social_properties.some(function(v) {
        return v.rawvalue;
      });
      this.is_existing_record = null;
      this.is_not_existing_record = null;
      this.existing_record = null;
      if (window.app_config.get('has_hubspot')) {
        if (((_ref = this.model.get('existing_records')) != null ? _ref.get('contacts') : void 0) != null) {
          this.is_existing_record = false;
          this.is_not_existing_record = true;
          if ((_ref1 = this.model.get('existing_records')) != null) {
            if ((_ref2 = _ref1.get('contacts')) != null) {
              _ref2.each((function(_this) {
                return function(contact) {
                  if ((contact != null ? contact.get('email').toLowerCase() : void 0) === _this.model.get('email').toLowerCase()) {
                    _this.existing_record = contact.getHubspotUrl();
                    _this.is_existing_record = true;
                    return _this.is_not_existing_record = false;
                  }
                };
              })(this));
            }
          }
        }
      } else {
        if ((((_ref3 = this.model.get('existing_records')) != null ? _ref3.get('contacts') : void 0) != null) && ((_ref4 = this.model.get('existing_records')) != null ? (_ref5 = _ref4.get('contacts')) != null ? _ref5.length : void 0 : void 0) > 0) {
          query_model = this.model;
        } else if (this.model.get('company_object') && (((_ref6 = this.model.get('company_object').get('existing_records')) != null ? _ref6.get('contacts') : void 0) != null)) {
          query_model = this.model.get('company_object');
        }
        if (query_model) {
          this.is_existing_record = false;
          this.is_not_existing_record = true;
          if ((_ref7 = query_model.get('existing_records')) != null) {
            if ((_ref8 = _ref7.get('contacts')) != null) {
              _ref8.each((function(_this) {
                return function(contact) {
                  if ((contact != null ? contact.get('email').toLowerCase() : void 0) === _this.model.get('email').toLowerCase()) {
                    _this.existing_record = contact.getSalesforceUrl();
                    _this.is_existing_record = true;
                    return _this.is_not_existing_record = false;
                  }
                };
              })(this));
            }
          }
        }
      }
    };

    ContactDataTable.prototype.update = function() {
      var data;
      this.refreshProperties();
      data = {
        visible_properties: this.visible_properties,
        hidden_properties: this.hidden_properties,
        social_properties: this.social_properties,
        has_hidden_properties: this.has_hidden_properties,
        has_social_properties: this.has_social_properties,
        company_name: this.model.get('company_name'),
        overview: this.model.get('description'),
        has_salesforce: window.app_config.get('has_salesforce'),
        has_hubspot: window.app_config.get('has_hubspot'),
        existing_record: this.existing_record,
        is_existing_record: this.is_existing_record,
        is_not_existing_record: this.is_not_existing_record
      };
      return ContactDataTable.__super__.update.call(this, data);
    };

    ContactDataTable.prototype.render = function() {
      var data;
      this.refreshProperties();
      data = {
        visible_properties: this.visible_properties,
        hidden_properties: this.hidden_properties,
        social_properties: this.social_properties,
        has_hidden_properties: this.has_hidden_properties,
        has_social_properties: this.has_social_properties,
        company_name: this.model.get('company_name'),
        overview: this.model.get('description'),
        has_salesforce: window.app_config.get('has_salesforce'),
        has_hubspot: window.app_config.get('has_hubspot'),
        existing_record: this.existing_record,
        is_existing_record: this.is_existing_record,
        is_not_existing_record: this.is_not_existing_record
      };
      return ContactDataTable.__super__.render.call(this, data);
    };

    return ContactDataTable;

  })(Sidekick.Views.DataTable);

  Sidekick.Views.ExistingRecordsTable = (function(_super) {
    __extends(ExistingRecordsTable, _super);

    function ExistingRecordsTable() {
      this.updateExistingRecordModels = __bind(this.updateExistingRecordModels, this);
      this.clickedEditAccountRecord = __bind(this.clickedEditAccountRecord, this);
      this.clickedEditOpportunityRecord = __bind(this.clickedEditOpportunityRecord, this);
      this.clickedEditLeadRecord = __bind(this.clickedEditLeadRecord, this);
      this.clickedRecord = __bind(this.clickedRecord, this);
      this.clickedClaimLeadRecord = __bind(this.clickedClaimLeadRecord, this);
      this.clickedSaveRecord = __bind(this.clickedSaveRecord, this);
      this.clickedExpand = __bind(this.clickedExpand, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.render = __bind(this.render, this);
      return ExistingRecordsTable.__super__.constructor.apply(this, arguments);
    }

    ExistingRecordsTable.prototype.className = 'existing-records-table';

    ExistingRecordsTable.prototype.template = window.HAML["existing_records_table"];

    ExistingRecordsTable.prototype.events = {
      'click .link-list-header a.expand-link': 'clickedExpand',
      'click .lead-record.existing-record a.edit-record-action': 'clickedEditLeadRecord',
      'click .opportunity-record.existing-record a.edit-record-action': 'clickedEditOpportunityRecord',
      'click .account-record.existing-record a.edit-record-action': 'clickedEditAccountRecord',
      'click .lead-record.existing-record a.claim-record-action': 'clickedClaimLeadRecord',
      'click .existing-records-list a.save-record': 'clickedSaveRecord'
    };

    ExistingRecordsTable.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:salesforce_instance_url', this.render);
      this.model.listenTo(this.model, 'change:existing_records', this.render);
      this.model.listenTo(this.model, 'change:salesforce_error_message', this.render);
      this.model.listenTo(this.model, 'change:company_name', this.render);
      this.existing_records_models = [];
      this.existing_records = null;
      this.limited = true;
    };

    ExistingRecordsTable.prototype.render = function() {
      var crm_base_url, existing_records_length, formatted_existing_records, limit, salesforce_error_message;
      if (this.limited) {
        limit = 4;
      } else {
        limit = 1000;
      }
      this.existing_records = this.model.get('existing_records');
      existing_records_length = 0;
      salesforce_error_message = null;
      if (this.model.get('salesforce_error_message')) {
        if (typeof console !== "undefined" && console !== null) {
          console.log(this.model.get('salesforce_error_message'));
        }
        salesforce_error_message = this.model.get('salesforce_error_message')[0].message;
      }
      if (this.existing_records) {
        formatted_existing_records = {};
        formatted_existing_records['account'] = this.existing_records.get('object_primary').toJSON();
        formatted_existing_records['opportunity'] = this.existing_records.get('object_secondary').toJSON();
        formatted_existing_records['lead'] = this.existing_records.get('object_tertiary').toJSON();
        if (this.existing_records.get('object_quaternary')) {
          formatted_existing_records['contact'] = this.existing_records.get('object_quaternary').toJSON();
        } else {
          formatted_existing_records['contact'] = [];
        }
        existing_records_length = formatted_existing_records['lead'].length + formatted_existing_records['opportunity'].length + formatted_existing_records['account'].length + formatted_existing_records['contact'].length;
      }
      if (window.app_config.get('has_hubspot')) {
        crm_base_url = this.model.get('hubspot_base_url');
      } else if (window.app_config.get('has_salesforce')) {
        crm_base_url = this.model.get('salesforce_instance_url');
      }
      this.$el.html(this.template({
        existing_records: this.existing_records,
        formatted_existing_records: formatted_existing_records,
        existing_records_length: existing_records_length,
        crm_base_url: crm_base_url,
        salesforce_error_message: salesforce_error_message,
        company_name: this.model.get('company_name'),
        limited: this.limited,
        limit: limit
      }));
      if (existing_records_length < 1) {
        this.$el.hide();
      } else {
        this.$el.show();
      }
      this.$('.tippable').tooltip();
      return this.$el;
    };

    ExistingRecordsTable.prototype.scrollUp = function() {
      this.$el.slideUp();
    };

    ExistingRecordsTable.prototype.scrollDown = function() {
      this.render();
      this.$el.slideDown();
    };

    ExistingRecordsTable.prototype.clickedExpand = function() {
      this.limited = !this.limited;
      this.render();
    };

    ExistingRecordsTable.prototype.clickedSaveRecord = function(event) {
      var $record;
      $record = $(event.currentTarget).parents('.edit-lead-detail').prev('.existing-record');
      $record.addClass('saving-record');
    };

    ExistingRecordsTable.prototype.clickedClaimLeadRecord = function(event) {
      var $record, existing_record_model;
      event.preventDefault();
      $record = $(event.currentTarget).parents('.existing-record');
      existing_record_model = this.existing_records.get('leads').get($record.data('id'));
      existing_record_model.set('add_lead_state', this.model.get('add_lead_state'));
      $record.addClass('claiming');
      existing_record_model.claimLead(function(data) {
        $record.removeClass('claiming');
        $record.addClass('claimed');
        if (data.success) {
          return $record.addClass('claim-success');
        } else {
          if (typeof console !== "undefined" && console !== null) {
            console.error("ERROR: " + data.error);
          }
          return $record.addClass('claim-error');
        }
      });
    };

    ExistingRecordsTable.prototype.clickedRecord = function($record, existing_record_model) {
      var addLeadDetailTable;
      this.$('.edit-lead-detail').slideUp();
      if ($record.hasClass('highlight')) {
        this.$('.existing-record').removeClass('highlight');
      } else {
        this.$('.existing-record').removeClass('highlight');
        this.existing_records_models.push(existing_record_model);
        this.model.listenTo(this.model, 'change:add_lead_state', this.updateExistingRecordModels);
        addLeadDetailTable = new Sidekick.Views.AddLeadDetail({
          model: existing_record_model
        });
        $record.after(addLeadDetailTable.render().hide());
        addLeadDetailTable.scrollDown();
      }
    };

    ExistingRecordsTable.prototype.clickedEditLeadRecord = function(event) {
      var $record, existing_record_model;
      event.preventDefault();
      $record = $(event.currentTarget).parents('.existing-record');
      existing_record_model = this.existing_records.get('leads').get($record.data('id'));
      existing_record_model.set('add_lead_state', this.model.get('add_lead_state'));
      return this.clickedRecord($record, existing_record_model);
    };

    ExistingRecordsTable.prototype.clickedEditOpportunityRecord = function(event) {
      var $record, existing_record_model;
      event.preventDefault();
      $record = $(event.currentTarget).parents('.existing-record');
      existing_record_model = this.existing_records.get('opportunities').get($record.data('id'));
      existing_record_model.set('add_lead_state', this.model.get('add_lead_state'));
      return this.clickedRecord($record, existing_record_model);
    };

    ExistingRecordsTable.prototype.clickedEditAccountRecord = function(event) {
      var $record, existing_record_model;
      event.preventDefault();
      $record = $(event.currentTarget).parents('.existing-record');
      existing_record_model = this.existing_records.get('accounts').get($record.data('id'));
      existing_record_model.set('add_lead_state', this.model.get('add_lead_state'));
      return this.clickedRecord($record, existing_record_model);
    };

    ExistingRecordsTable.prototype.updateExistingRecordModels = function() {
      var existing_record_model, _i, _len, _ref, _results;
      _ref = this.existing_record_models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        existing_record_model = _ref[_i];
        _results.push(existing_record_model.set('add_lead_state', this.model.get('add_lead_state')));
      }
      return _results;
    };

    return ExistingRecordsTable;

  })(Backbone.View);

  Sidekick.Views.Header = (function(_super) {
    __extends(Header, _super);

    function Header() {
      this.close = __bind(this.close, this);
      this.expand = __bind(this.expand, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.className = 'header';

    Header.prototype.company_template = window.HAML["header_company"];

    Header.prototype.contact_template = window.HAML["header_contact"];

    Header.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:company_name', this.update);
      this.model.listenTo(this.model, 'change:name', this.update);
      this.model.listenTo(this.model, 'change:company_data_status', this.update);
      this.is_child_view = data.is_child_view;
    };

    Header.prototype.render = function() {
      var company_name;
      if (this.model.get('type') === 'company') {
        if (this.model.get('company_name') && !(this.model.get('company_data_status') === 'error')) {
          company_name = this.model.get('company_name');
        } else {
          company_name = this.model.get('domain');
        }
        this.$el.html(this.company_template({
          company_name: company_name,
          domain: this.model.get('domain'),
          is_child_view: this.is_child_view
        }));
      } else {
        this.$el.html(this.contact_template({
          name: this.model.get('name'),
          email: this.model.get('email'),
          avatar_url: this.model.get('avatar_url'),
          company_name: this.model.get('company_name'),
          title: this.model.get('title'),
          location: this.model.get('location')
        }));
        this.$el.addClass('contact-header');
      }
      this.$('img.company-avatar').one('error', function() {
        return this.src = '/static/img/default_avatar.png';
      });
      this.$('img.header-contact-avatar').one('error', function() {
        return this.src = '/static/img/default_avatar.png';
      });
      if (this.model.get('type') === 'contact') {
        this.update();
      }
      return this.$el;
    };

    Header.prototype.update = function() {
      if (this.model.get('type') === 'contact') {
        if (this.model.get('company_name') && this.model.get('title')) {
          this.$('.secondary-name').text("" + (this.model.get('company_name')) + ", " + (this.model.get('title')));
        } else if (this.model.get('title')) {
          this.$('.secondary-name').text("" + (this.model.get('title')));
        } else if (this.model.get('company_name')) {
          this.$('.secondary-name').text("" + (this.model.get('company_name')));
        } else if (this.model.get('name') && this.model.get('email')) {
          this.$('.secondary-name').text("" + (this.model.get('email')));
        }
        if (this.model.get('name')) {
          this.$('.primary-name').html(this.model.get('name'));
        } else {
          this.$('.primary-name').text(this.model.get('email'));
        }
      } else {
        return this.render();
      }
    };

    Header.prototype.expand = function() {
      $('.expand-container i').removeClass("icon-double-angle-up").addClass("icon-double-angle-down");
    };

    Header.prototype.close = function() {
      $('.expand-container i').removeClass("icon-double-angle-down").addClass("icon-double-angle-up");
    };

    return Header;

  })(Backbone.View);

  Sidekick.Views.LeadView = (function(_super) {
    __extends(LeadView, _super);

    function LeadView() {
      this.expandCompanyInsights = __bind(this.expandCompanyInsights, this);
      this.clickedError = __bind(this.clickedError, this);
      this.clickedViewRelatedCompanies = __bind(this.clickedViewRelatedCompanies, this);
      this.getLeadStatus = __bind(this.getLeadStatus, this);
      this.updateLeadStatus = __bind(this.updateLeadStatus, this);
      this.attach = __bind(this.attach, this);
      this.unattach = __bind(this.unattach, this);
      this.render = __bind(this.render, this);
      this.renderCompanyObject = __bind(this.renderCompanyObject, this);
      return LeadView.__super__.constructor.apply(this, arguments);
    }

    LeadView.prototype.className = 'lead-view';

    LeadView.prototype.events = {
      'click .related-companies-table a.view-related-companies-btn': 'clickedViewRelatedCompanies',
      'click a.banner-button.add-as-lead.adding.error': 'clickedError',
      'click .child-lead-view .header': 'expandCompanyInsights'
    };

    LeadView.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:status', this.updateLeadStatus);
      this.domain = this.model.get('domain');
      this.is_child_view = data.is_child_view;
      this.sub_views = [];
      if (this.model.get('type') === 'company') {
        this.header = new Sidekick.Views.Header({
          model: this.model,
          is_child_view: this.is_child_view
        });
        this.companyContactsTable = new Sidekick.Views.CompanyContactsTable({
          model: this.model
        });
        this.companyConnectionsTable = new Sidekick.Views.CompanyConnectionsTable({
          model: this.model
        });
        this.relatedCompaniesTable = new Sidekick.Views.RelatedCompaniesTable({
          model: this.model
        });
        this.dataTable = new Sidekick.Views.CompanyDataTable({
          model: this.model
        });
        this.existingRecordsTable = new Sidekick.Views.ExistingRecordsTable({
          model: this.model
        });
        this.sub_views.concat([this.header, this.companyContactsTable, this.companyConnectionsTable, this.relatedCompaniesTable, this.dataTable, this.existingRecordsTable]);
      } else if (this.model.get('type') === 'contact') {
        if (window.app_config.get('is_user_profile')) {
          this.signalsActivitiesTable = new Sidekick.Views.SignalsActivitiesTable({
            model: this.model
          });
          this.sub_views.push(this.signalsActivitiesTable);
        } else {
          this.header = new Sidekick.Views.Header({
            model: this.model,
            is_child_view: this.is_child_view
          });
          if (!this.model.get('no-reply')) {
            this.socialStreamsContainer = new Sidekick.Views.SocialStreamsContainer({
              model: this.model
            });
            this.dataTable = new Sidekick.Views.ContactDataTable({
              model: this.model
            });
            this.sub_views.push(this.socialStreamsContainer);
            this.sub_views.push(this.header);
            this.sub_views.push(this.dataTable);
          }
          if (this.model.get('company_object')) {
            this.childLeadView = new Sidekick.Views.LeadView({
              model: this.model.get('company_object'),
              is_child_view: true
            });
          }
        }
      }
      if (this.is_child_view) {
        this.model.listenTo(this.model, 'change', this.renderCompanyObject);
      }
      if (this.dataTable) {
        this.model.listenTo(this.model, 'change:revenue', this.dataTable.update);
        this.model.listenTo(this.model, 'change:employees', this.dataTable.update);
        this.model.listenTo(this.model, 'change:state', this.dataTable.update);
        this.model.listenTo(this.model, 'change:overview', this.dataTable.update);
        this.model.listenTo(this.model, 'change:last_touch_date', this.dataTable.update);
      }
    };

    LeadView.prototype.renderCompanyObject = function() {
      if (this.model.get('company_name')) {
        return this.attach();
      }
    };

    LeadView.prototype.render = function() {
      if (this.header) {
        this.$el.append(this.header.render());
      }
      if (!window.app_config.get('is_user_profile')) {
        if (this.dataTable) {
          this.$el.append(this.dataTable.render());
        }
        if (window.app_config.get('has_salesforce') || window.app_config.get('has_hubspot')) {
          if (this.model.get('type') === 'company') {
            if (this.existingRecordsTable != null) {
              this.$el.append(this.existingRecordsTable.render());
            }
          }
        }
      }
      if (this.model.get('type') === 'company') {
        this.$el.append(this.companyConnectionsTable.render());
        this.$el.append(this.companyContactsTable.render());
        this.$el.append(this.relatedCompaniesTable.render());
      } else if (this.model.get('type') === "contact") {
        if (this.childLeadView) {
          this.$el.append("<div class='child-company-container'>");
          this.$el.find('.child-company-container').append(this.childLeadView.render());
        }
        if (this.socialStreamsContainer) {
          this.$el.append(this.socialStreamsContainer.render());
        } else if (this.signalsActivitiesTable) {
          this.$el.append(this.signalsActivitiesTable.render());
        }
      }
      if (!this.$el.hasClass('has-status')) {
        this.$el.addClass('no-status');
        this.getLeadStatus();
      }
      if (this.is_child_view) {
        this.$el.addClass('child-lead-view');
        this.$el.hide();
      }
      return this.$el;
    };

    LeadView.prototype.unattach = function() {
      var company_contacts, company_object, unattachView, view, _i, _len, _ref;
      unattachView = (function(_this) {
        return function(view) {
          _this.model.off(null, null, view);
          view.undelegateEvents();
          view.$el.removeData().unbind();
          view.remove();
          return Backbone.View.prototype.remove.call(view);
        };
      })(this);
      _ref = this.sub_views;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        unattachView(view);
      }
      if (this.childLeadView) {
        this.childLeadView.unattach();
      }
      if (company_object = this.model.get('company_object')) {
        company_object.removeRecords();
        company_object.destroy();
        this.model.set('company_object', null);
      } else if (company_contacts = this.model.get('company_contacts')) {
        company_contacts = null;
        this.model.set('company_contacts', null);
      }
      this.model.removeRecords();
      this.model.stopListening();
      this.model.id = null;
      this.model.destroy();
      unattachView(this);
    };

    LeadView.prototype.attach = function() {
      this.$el.fadeIn();
    };

    LeadView.prototype.updateLeadStatus = function() {
      this.$el.addClass(this.model.get('status')).addClass('has-status').removeClass('no-status');
      if (this.model.get('salesforce_error_message')) {
        this.$el.addClass('lead-status-error').addClass('has-status');
      }
    };

    LeadView.prototype.getLeadStatus = function() {
      if (window.app_config.get('has_hubspot')) {
        if (this.model.get('type') === 'company') {
          if (this.domain) {
            return $.getJSON("/companies/sidekick/" + this.domain + "/hscrm/records.json", "", (function(_this) {
              return function(data, textStatus, jqXHR) {
                return _this.model.registerHSCRMStatus(data);
              };
            })(this));
          }
        } else {
          return $.getJSON("/contacts/sidekick/" + (this.model.get('email')) + "/hscrm/records.json", "", (function(_this) {
            return function(data, textStatus, jqXHR) {
              return _this.model.registerHSCRMStatus(data);
            };
          })(this));
        }
      } else if (window.app_config.get('has_salesforce') && this.domain) {
        return $.getJSON("/companies/sidekick/" + this.domain + "/lead_status.json", "", (function(_this) {
          return function(data, textStatus, jqXHR) {
            return _this.model.registerLeadStatus(data);
          };
        })(this));
      }
    };

    LeadView.prototype.clickedViewRelatedCompanies = function() {
      if ($('.related-companies-list').is(':visible')) {
        this.relatedCompaniesTable.scrollUp();
      } else {
        this.relatedCompaniesTable.scrollDown();
      }
    };

    LeadView.prototype.clickedError = function(e) {
      window.open($(e.currentTarget).data('help-url'), '_blank');
    };

    LeadView.prototype.expandCompanyInsights = function(e) {
      var run;
      if (this.$('.child-lead-view').hasClass("show-company-data")) {
        this.$('.show-company-data').removeClass("show-company-data");
        run = function() {
          return $('.child-company-container').css('top', 'auto');
        };
        setTimeout(run, 500);
        this.header.close();
      } else {
        $('.child-company-container').css('top', '50px');
        this.$('.child-lead-view').addClass("show-company-data");
        this.header.expand();
      }
      return this;
    };

    return LeadView;

  })(Backbone.View);

  Sidekick.Views.RelatedCompaniesTable = (function(_super) {
    __extends(RelatedCompaniesTable, _super);

    function RelatedCompaniesTable() {
      this.clickedRelatedCompany = __bind(this.clickedRelatedCompany, this);
      this.clickedHeader = __bind(this.clickedHeader, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.render = __bind(this.render, this);
      return RelatedCompaniesTable.__super__.constructor.apply(this, arguments);
    }

    RelatedCompaniesTable.prototype.className = 'related-companies-table';

    RelatedCompaniesTable.prototype.template = window.HAML["related_companies_table"];

    RelatedCompaniesTable.prototype.events = {
      'click .link-list-header a.expand-link': 'clickedHeader',
      'click a.related-company-link': 'clickedRelatedCompany'
    };

    RelatedCompaniesTable.prototype.initialize = function(data) {
      this.model.on('change:related_companies', this.render);
    };

    RelatedCompaniesTable.prototype.render = function() {
      var related_companies;
      related_companies = this.model.get('related_companies');
      this.$el.html(this.template({
        related_companies: related_companies,
        company_name: this.model.get('company_name'),
        has_salesforce: window.app_config.get('has_salesforce')
      }));
      $(".related_companies-list", this.$el).show();
      if (related_companies && related_companies.length > 0) {
        $(".view-related_companies", this.$el).fadeIn('fast');
      }
      this.$('.tippable').tooltip();
      return this.$el;
    };

    RelatedCompaniesTable.prototype.scrollDown = function() {
      $(".related_companies-list", this.$el).slideDown();
      this.$el.addClass('visible');
    };

    RelatedCompaniesTable.prototype.scrollUp = function() {
      $(".related_companies-list", this.$el).slideUp();
      this.$el.removeClass('visible');
    };

    RelatedCompaniesTable.prototype.clickedHeader = function() {
      this.$(".link-list-header").toggleClass('expanded');
      this.$(".link-list").toggleClass('expanded');
    };

    RelatedCompaniesTable.prototype.clickedRelatedCompany = function(event) {
      var $company, url_direct, url_passthrough;
      event.preventDefault();
      $company = $(event.currentTarget).parents('.related-company');
      url_direct = "http://" + ($company.data('domain')) + "?insights=true";
      url_passthrough = "" + window.server_base + "/insights?url=http://" + ($company.data('domain'));
      return window.open(url_direct, "_blank");
    };

    return RelatedCompaniesTable;

  })(Backbone.View);

  Sidekick.Views.SignalsActivitiesTable = (function(_super) {
    __extends(SignalsActivitiesTable, _super);

    function SignalsActivitiesTable() {
      this.clickedThread = __bind(this.clickedThread, this);
      this.render = __bind(this.render, this);
      return SignalsActivitiesTable.__super__.constructor.apply(this, arguments);
    }

    SignalsActivitiesTable.prototype.className = 'signals-activities-table';

    SignalsActivitiesTable.prototype.template = window.HAML["signals_activities_table"];

    SignalsActivitiesTable.prototype.events = {
      'click a.activity-link': 'clickedThread'
    };

    SignalsActivitiesTable.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:activities', this.render);
      this.limited = true;
    };

    SignalsActivitiesTable.prototype.render = function() {
      var limit;
      this.activities = this.model.get('activities');
      if (this.limited) {
        if (window.app_config.get('is_user_profile')) {
          limit = 20;
        } else {
          limit = 6;
        }
      } else {
        limit = 1000;
      }
      this.$el.html(this.template({
        activities: this.activities,
        limited: this.limited,
        limit: limit,
        is_user_profile: window.app_config.get('is_user_profile')
      }));
      this.$('.tippable').tooltip();
      return this.$el;
    };

    SignalsActivitiesTable.prototype.clickedThread = function(e) {
      var message_link, split_message;
      e.preventDefault();
      message_link = $(e.currentTarget).attr('href');
      split_message = message_link.split("#");
      if (split_message.length > 1 && window.app_config.get('is_gmail')) {
        if (typeof console !== "undefined" && console !== null) {
          console.log(split_message[1]);
        }
        window.sendMsg('threadGmail', {
          message_hash: split_message[1]
        });
      } else {
        e.stopPropagation();
        window.open(message_link, '_blank');
      }
    };

    return SignalsActivitiesTable;

  })(Backbone.View);

  Sidekick.Views.SocialStreamsContainer = (function(_super) {
    __extends(SocialStreamsContainer, _super);

    function SocialStreamsContainer() {
      this.remove = __bind(this.remove, this);
      this.clickedEmail = __bind(this.clickedEmail, this);
      this.selectStream = __bind(this.selectStream, this);
      this.switchStream = __bind(this.switchStream, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      return SocialStreamsContainer.__super__.constructor.apply(this, arguments);
    }

    SocialStreamsContainer.prototype.className = 'social-streams-container';

    SocialStreamsContainer.prototype.template = window.HAML["social_streams_container"];

    SocialStreamsContainer.prototype.events = {
      'click .stream-heading': 'selectStream',
      'click a.email-link': 'clickedEmail'
    };

    SocialStreamsContainer.prototype.initialize = function(data) {
      this.model.listenTo(this.model, 'change:activities', this.update);
      this.model.listenTo(this.model, 'change:twitter_name', this.update);
      this.model.listenTo(this.model, 'change:social_profiles', this.update);
      this.signalsActivitiesTable = new Sidekick.Views.SignalsActivitiesTable({
        model: this.model
      });
      this.twitterTimeline = new Sidekick.Views.TwitterTimeline({
        model: this.model
      });
    };

    SocialStreamsContainer.prototype.render = function(data) {
      if (!this.rendered) {
        this.rendered = true;
        this.$el.html(this.template(data));
      }
      this.update(data);
      return this.$el;
    };

    SocialStreamsContainer.prototype.update = function(data) {
      var display_value, social_profile, social_profiles, social_properties, _i, _len;
      if (this.model.get('activities')) {
        if (this.model.get('activities').length > 0) {
          this.$('.stream-heading[data-stream-type="signals"]').removeClass('hide');
          this.$('.social-stream[data-stream-type="signals"]').html(this.signalsActivitiesTable.render());
          if (!this.selected_stream) {
            this.current_stream = 'signals';
            this.switchStream();
          }
        }
        if (this.model.get('twitter_name')) {
          this.$('.stream-heading[data-stream-type="twitter"]').removeClass('hide');
          this.$('.social-stream[data-stream-type="twitter"]').html(this.twitterTimeline.render());
          if (!this.selected_stream && this.model.get('activities').length === 0) {
            this.current_stream = 'twitter';
            this.switchStream();
          }
        }
      }
      if (this.model.get('social_profiles')) {
        social_properties = [];
        if (social_profiles = this.model.get('social_profiles')) {
          for (_i = 0, _len = social_profiles.length; _i < _len; _i++) {
            social_profile = social_profiles[_i];
            if (social_profile.typeid !== "twitter") {
              if (social_profile.username) {
                display_value = social_profile.username;
              } else {
                display_value = "" + social_profile.typename + " Page";
              }
              social_properties.push({
                'label': social_profile.typename,
                'iconname': social_profile.iconname,
                'value': display_value,
                'link': social_profile.url,
                'rawvalue': social_profile.url,
                'email': (social_profile.email != null) && social_profile.email
              });
            }
          }
        }
        return this.$('.other-social-links').html(window.HAML["social_properties"]({
          social_properties: social_properties
        }));
      }
    };

    SocialStreamsContainer.prototype.switchStream = function() {
      this.$(".stream-heading").removeClass('active');
      this.$(".stream-heading[data-stream-type=" + this.current_stream + "]").addClass('active');
      this.$(".social-stream").addClass('hide');
      return this.$(".social-stream[data-stream-type=" + this.current_stream + "]").removeClass('hide');
    };

    SocialStreamsContainer.prototype.selectStream = function(e) {
      this.selected_stream = $(e.currentTarget).data('stream-type');
      this.current_stream = this.selected_stream;
      return this.switchStream();
    };

    SocialStreamsContainer.prototype.clickedEmail = function(e) {
      var email_clicked;
      e.preventDefault();
      e.stopPropagation();
      email_clicked = $(e.currentTarget).attr('href');
      return window.sendMsg('emailGmail', {
        email: email_clicked
      });
    };

    SocialStreamsContainer.prototype.remove = function() {
      if (this.signalsActivitiesTable) {
        this.signalsActivitiesTable.undelegateEvents();
        this.signalsActivitiesTable.$el.removeData().unbind();
        this.signalsActivitiesTable.remove();
        Backbone.View.prototype.remove.call(this.signalsActivitiesTable);
      }
      if (this.twitterTimeline) {
        this.twitterTimeline.undelegateEvents();
        this.twitterTimeline.$el.removeData().unbind();
        this.twitterTimeline.remove();
        Backbone.View.prototype.remove.call(this.twitterTimeline);
      }
      this.$el.remove();
    };

    return SocialStreamsContainer;

  })(Backbone.View);

  Sidekick.Views.TwitterTimeline = (function(_super) {
    __extends(TwitterTimeline, _super);

    function TwitterTimeline() {
      this.initializeTwitterWidget = __bind(this.initializeTwitterWidget, this);
      this.isRendered = __bind(this.isRendered, this);
      this.scrollUp = __bind(this.scrollUp, this);
      this.scrollDown = __bind(this.scrollDown, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      return TwitterTimeline.__super__.constructor.apply(this, arguments);
    }

    TwitterTimeline.prototype.className = 'twitter-time-line';

    TwitterTimeline.prototype.template = window.HAML["twitter_timeline"];

    TwitterTimeline.prototype.initialize = function(data) {
      this.widget_id = "504028277741060096";
      this.limit = 3;
    };

    TwitterTimeline.prototype.render = function() {
      this.update();
      return this.$el;
    };

    TwitterTimeline.prototype.update = function() {
      if (!this.rendered && this.model.get('twitter_name')) {
        this.rendered = true;
        this.$el.html(this.template({
          twitter_name: this.model.get('twitter_name'),
          widget_id: this.widget_id,
          limit: this.limit
        }));
        this.initializeTwitterWidget();
        this.$('.tippable').tooltip();
      }
      return this.$el;
    };

    TwitterTimeline.prototype.scrollDown = function() {
      $(".twitter-time-line", this.$el).slideDown();
      this.$el.addClass('visible');
    };

    TwitterTimeline.prototype.scrollUp = function() {
      $(".twitter-time-line", this.$el).slideUp();
      this.$el.removeClass('visible');
    };

    TwitterTimeline.prototype.isRendered = function() {
      return this.rendered;
    };

    TwitterTimeline.prototype.initializeTwitterWidget = function() {
      var unique_twitter_widget_instance_id, _twitter_setup;
      _twitter_setup = function(d, s, id) {
        var fjs, js, p;
        js = void 0;
        fjs = d.getElementsByTagName(s)[0];
        p = (/^http:/.test(d.location) ? "http" : "https");
        js = d.createElement(s);
        js.id = id;
        js.src = p + "://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
      };
      unique_twitter_widget_instance_id = Math.floor(Math.random() * 10000);
      _twitter_setup(document, "script", this.model.get('twitter_name') + unique_twitter_widget_instance_id);
    };

    return TwitterTimeline;

  })(Backbone.View);

}).call(this);
