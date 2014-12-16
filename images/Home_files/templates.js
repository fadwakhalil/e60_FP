(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['add_hubspot_record_detail_table'] = function(context) {
    return (function() {
      var $c, $e, $o, company, i, prop, status, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='edit-detail-container'>\n  <form class='new-hubspot-record' method='POST' action='" + ($e($c(this.create_url))) + "'>");
      _ref = this.valid_hidden_properties;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        if (prop.value) {
          $o.push("    <input type='hidden' name='" + ($e($c(prop.property))) + "' value='" + ($e($c(prop.value))) + "'>");
        }
      }
      $o.push("    <div class='data-table edit-details editable'>\n      <div class='data-row'>\n        <div class='data-col'>\n          Company\n        </div>\n        <div class='data-col'>");
      if (this.companies) {
        $o.push("          <select class='data-field' name='company'>");
        _ref1 = this.companies;
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          company = _ref1[i];
          $o.push("            <option value='" + ($e($c(i))) + "'>\n              " + company['company_name'] + "\n            </option>");
        }
        $o.push("            <option value='NEW'>\n              Create \"" + this.company + "\"\n            </option>\n          </select>\n          <i class='icon-chevron-down pull-right'></i>");
      } else {
        if (this.type === "Company") {
          $o.push("          <input class='data-field' type='text' name='name' placeholder='" + ($e($c(this.company ? this.company : 'Add Company'))) + "' prefilled='" + ($e($c(!!this.company))) + "'>\n          <i class='icon-pencil pull-right'></i>");
        } else {
          $o.push("          <input class='data-field' type='text' name='company' placeholder='" + ($e($c(this.company ? this.company : 'Add Company'))) + "' prefilled='" + ($e($c(!!this.company))) + "'>\n          <i class='icon-pencil pull-right'></i>");
        }
      }
      $o.push("        </div>\n      </div>");
      _ref2 = this.valid_visible_properties;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        prop = _ref2[_k];
        $o.push("      <div class='data-row'>\n        <div class='data-col'>\n          " + prop.label + "\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='" + ($e($c(prop.property))) + "' placeholder='" + ($e($c(prop.value ? prop.value : 'Add ' + prop.label))) + "' prefilled='" + ($e($c(!!prop.value))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>");
      }
      if (this.type === "Company") {
        $o.push("      <div class='data-row'>\n        <div class='data-col'>\n          Status\n        </div>\n        <div class='data-col'>\n          <select class='data-field' name='hs_lead_status'>");
        if (this.statuses) {
          _ref3 = this.statuses;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            status = _ref3[_l];
            $o.push("            <option value='" + ($e($c(status.value))) + "'>\n              " + status.label + "\n            </option>");
          }
        }
        $o.push("          </select>\n          <i class='icon-chevron-down pull-right'></i>\n        </div>\n      </div>");
      }
      if (this.type === "Contact") {
        $o.push("      <div class='data-row'>\n        <div class='data-col'>\n          Lifecycle\n        </div>\n        <div class='data-col'>\n          <select class='data-field' name='lifecyclestage'>");
        if (this.lifecycle_stages) {
          _ref4 = this.lifecycle_stages;
          for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
            status = _ref4[_m];
            $o.push("            <option value='" + ($e($c(status.value))) + "'>\n              " + status.label + "\n            </option>");
          }
        }
        $o.push("          </select>\n          <i class='icon-chevron-down pull-right'></i>\n        </div>\n      </div>");
      }
      $o.push("    </div>\n    <a class='button banner-button input-block-level real-button primary-button multi-state-button save-record' href='#' data-help-url='http://support.getsignals.com/knowledgebase/articles/246456-resolving-salesforce-integration-errors'>\n      <div class='adding-success'>\n        Adding as " + this.type + "...\n        <div class='adding-animation icon-signals-loop play pull-right'></div>\n      </div>\n      <div class='searching-status'>\n        Searching in HubSpot...\n        <div class='adding-animation icon-signals-loop play pull-right'></div>\n      </div>\n      <div class='default save'>\n        Save " + this.type + "<span class=\"normal\"> in HubSpot</span>\n        <i class='icon-ok pull-right'></i>\n      </div>\n      <div class='added-error'>\n        Error adding " + this.type + "\n        <i class='icon-info pull-right'></i>\n        <div class='subtext'>\n          Error\n        </div>\n      </div>\n    </a>\n    <div class='error notice' style='display:none;'>\n      <i class='icon-remove-sign'>\n        Error adding " + this.type + " to HubSpot\n      </i>\n      <div class='error-detail subtext'>\n        Details: <strong>" + this.hscrm_error_message + "</strong>\n      </div>\n    </div>\n    <a class='hide button banner-button real-button crm-button existing-button input-block-level view-in-crm' href='#' target='_blank'>\n      View in CRM\n      <i class='icon-chevron-right pull-right'></i>\n    </a>\n    <a class='banner banner-button existing no-link'>\n      <!-- %i{:class => \"icon-sort-down pull-right\"} -->\n      <i class='icon-hubspot pull-right'></i>\n      Existing " + this.type + " in HubSpot\n    </a>\n    <div class='cancel-container'>\n      <a class='muted cancel small-link' href='#'>\n        Cancel\n      </a>\n    </div>\n  </form>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['add_lead_cta_container'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<a class='banner banner-button lead-error' target='_blank' href='http://support.getsignals.com/knowledgebase/articles/246456-resolving-salesforce-integration-errors'>\n  <i class='icon-info pull-right'></i>\n  Salesforce Lookup Error\n</a>\n<a class='button banner-button input-block-level add-as-lead' href='#' data-help-url='http://support.getsignals.com/knowledgebase/articles/246456-resolving-salesforce-integration-errors'>\n  <div class='adding-success'>\n    Adding as Lead...\n    <div class='adding-animation icon-signals-loop play pull-right'></div>\n  </div>\n  <div class='default'>\n    Add to Salesforce\n    <i class='icon-plus-sign pull-right'></i>\n  </div>\n  <div class='save' style='display: none;'>\n    Save Record<span class=\"normal\"> in Salesforce</span>\n    <i class='icon-ok pull-right'></i>\n  </div>\n  <div class='added-success'>\n    Lead added to Salesforce\n    <i class='icon-ok-sign pull-right'></i>\n  </div>\n  <div class='added-error'>\n    Error adding lead\n    <i class='icon-info pull-right'></i>\n    <div class='subtext'>\n      " + this.error_message + "\n    </div>\n  </div>\n</a>\n<a class='banner banner-button searching' target='_blank' href='#'>\n  Searching in Salesforce...\n  <div class='adding-animation icon-signals-loop play pull-right'></div>\n</a>\n<a class='banner banner-button existing no-link'>\n  <!-- %i{:class => \"icon-sort-down pull-right\"} -->\n  <i class='icon-salesforce pull-right'></i>\n  Existing Record in Salesforce\n</a>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['add_lead_detail_table'] = function(context) {
    return (function() {
      var $c, $e, $o, status, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<!-- %h4 -->\n<!--   New <strong>Record</strong> in Salesforce -->\n<!--   %i.icon-salesforce.pull-right -->\n<div class='edit-detail-container'>\n  <form class='new-sfdc-lead' method='POST' action='/contacts/salesforce/leads/new.json'>\n    <input type='hidden' name='Website' value='" + ($e($c(this.domain))) + "'>\n    <!-- %input{:type => \"hidden\", :name => \"NumberOfEmployees\", :value => \"" + this.employees + "\"} -->\n    <!-- %input{:type => \"hidden\", :name => \"StateCode\", :value => \"" + this.state + "\"} -->\n    <!-- %input{:type => \"hidden\", :name => \"PhotoUrl\", :value => \"https://api.hubapi.com/socialintel/v1/avatars?domain=" + this.domain + "\"} -->");
      if (this.salesforce_id) {
        $o.push("    <input type='hidden' name='Id' value='" + ($e($c(this.salesforce_id))) + "'>");
      }
      if (this.overview) {
        $o.push("    <input type='hidden' name='Description' value='" + ($e($c(this.overview))) + "'>");
      }
      $o.push("    <div class='data-table edit-details editable'>\n      <div class='data-row'>\n        <div class='data-col'>\n          Lead Status\n        </div>\n        <div class='data-col'>");
      if (this.input_statuses) {
        $o.push("          <select class='data-field' name='Status'>");
        _ref = this.input_statuses;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          status = _ref[_i];
          $o.push("            <option value='" + ($e($c(status))) + "'>\n              " + status + "\n            </option>");
        }
        $o.push("          </select>\n          <i class='icon-chevron-down pull-right'></i>");
      } else {
        $o.push("          <span>\n            Loading Salesforce Statuses\n          </span>");
      }
      $o.push("        </div>\n      </div>\n      <div class='data-row'>\n        <div class='data-col'>\n          First Name\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='FirstName' placeholder='" + ($e($c(this.first_name ? this.first_name : 'Add first name'))) + "' prefilled='" + ($e($c(!!this.first_name))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>\n      <div class='data-row'>\n        <div class='data-col'>\n          Last Name\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='LastName' placeholder='" + ($e($c(this.last_name ? this.last_name : 'Add last name'))) + "' prefilled='" + ($e($c(!!this.last_name))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>\n      <div class='data-row'>\n        <div class='data-col'>\n          Company\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='Company' placeholder='" + ($e($c(this.company ? this.company : 'Add company'))) + "' prefilled='" + ($e($c(!!this.company))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>\n      <div class='data-row'>\n        <div class='data-col'>\n          Website\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='Website' placeholder='" + ($e($c(this.domain))) + "' prefilled='" + ($e($c(!!this.domain))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>\n      <div class='data-row'>\n        <div class='data-col'>\n          Title\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='Title' placeholder='" + ($e($c(this.title ? this.title : 'Add title'))) + "' prefilled='" + ($e($c(!!this.title))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>\n      <div class='data-row'>\n        <div class='data-col'>\n          Email\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='Email' placeholder='" + ($e($c(this.email ? this.email : 'Add email'))) + "' prefilled='" + ($e($c(!!this.email))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>\n      <div class='data-row'>\n        <div class='data-col'>\n          Phone\n        </div>\n        <div class='data-col'>\n          <input class='data-field' type='text' name='Phone' placeholder='" + ($e($c(this.phone ? this.phone : 'Add phone'))) + "' prefilled='" + ($e($c(!!this.phone))) + "'>\n          <i class='icon-pencil pull-right'></i>\n        </div>\n      </div>\n    </div>\n    <a class='button banner-button input-block-level real-button primary-button multi-state-button save-record' href='#' data-help-url='http://support.getsignals.com/knowledgebase/articles/246456-resolving-salesforce-integration-errors'>");
      if (this.salesforce_id) {
        $o.push("      <div class='adding-success'>\n        Updating Lead...\n        <div class='adding-animation icon-signals-loop play pull-right'></div>\n      </div>\n      <div class='searching-status'>\n        Searching in Salesforce...\n        <div class='adding-animation icon-signals-loop play pull-right'></div>\n      </div>\n      <div class='default save'>\n        Update Record<span class=\"normal\"> in Salesforce</span>\n        <i class='icon-ok pull-right'></i>\n      </div>\n      <div class='added-error'>\n        Error updating lead\n        <i class='icon-info pull-right'></i>\n        <div class='subtext'>\n          " + this.salesforce_error_message + "\n        </div>\n      </div>");
      } else {
        $o.push("      <div class='adding-success'>\n        Adding as Lead...\n        <div class='adding-animation icon-signals-loop play pull-right'></div>\n      </div>\n      <div class='searching-status'>\n        Searching in Salesforce...\n        <div class='adding-animation icon-signals-loop play pull-right'></div>\n      </div>\n      <div class='default save'>\n        Save Record<span class=\"normal\"> in Salesforce</span>\n        <i class='icon-ok pull-right'></i>\n      </div>\n      <div class='added-error'>\n        Error adding lead\n        <i class='icon-info pull-right'></i>\n        <div class='subtext'>\n          " + this.salesforce_error_message + "\n        </div>\n      </div>");
      }
      $o.push("    </a>\n    <div class='error notice' style='display:none;'>\n      <i class='icon-remove-sign'></i>");
      if (this.salesforce_id) {
        $o.push("      Error updating record in Salesforce");
      } else {
        $o.push("      Error adding record to Salesforce");
      }
      $o.push("      <div class='error-detail subtext'>\n        Details: <strong>\"" + this.salesforce_error_message + "\"</strong>\n      </div>\n    </div>\n    <div class='notice success' style='display:none;'>\n      <i class='icon-ok-sign'></i>");
      if (this.salesforce_id) {
        $o.push("      Record updated in Salesforce");
      } else {
        $o.push("      Record added to Salesforce");
      }
      $o.push("      <span class='divider'>\n        ·\n      </span>\n      <a class='existing-record-link external-link' href='#' target='_blank'>\n        View\n      </a>\n    </div>\n    <a class='banner banner-button existing no-link'>\n      <!-- %i{:class => \"icon-sort-down pull-right\"} -->\n      <i class='icon-salesforce pull-right'></i>\n      Existing Record in Salesforce\n    </a>\n    <div class='cancel-container'>\n      <a class='muted cancel small-link' href='#'>\n        Cancel\n      </a>\n    </div>\n  </form>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['add_to_salesforce_button'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<a class='button banner-button input-block-level add-as-lead' href='#'>\n  <div class='default'>\n    Add to Salesforce\n    <i class='icon-plus-sign pull-right'></i>\n  </div>\n</a>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['back_container'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<a class='back-banner' href='#'>\n  <i class='icon-chevron-left'></i>\n  Back to " + this.previous_domain + "\n</a>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['banner_container'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<a class='banner banner-button existing' target='_blank' href='#'>\n  <i class='icon-salesforce pull-right'></i>\n  View Lead <span class=\"normal\">in Salesforce</span>\n</a>\n<a class='banner banner-button lead-error' target='_blank' href='#'>\n  <span class='pull-right'>\n    details\n  </span>\n  Salesforce Error\n</a>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['company_connections_table'] = function(context) {
    return (function() {
      var $c, $e, $o, contact, i, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      if (this.inbox_connected) {
        if (this.company_connections) {
          if (this.company_connections.length > 0) {
            $o.push("<div class='view-company-connections link-list-header" + (!this.limited ? " expanded" : "") + (this.has_avatars ? " has-avatars" : "") + "'>\n  <h4>\n    <strong>\n      Email Connections\n    </strong>\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Contacts at " + ($e($c(this.company_name))) + " that are connected to your colleagues'></i>\n    <span class='link-actions pull-right'>");
            if (this.limited && this.company_connections.length > this.limit) {
              $o.push("      <a class='expand-link' href='#'>\n        Show More\n      </a>");
            }
            $o.push("    </span>\n  </h4>\n</div>\n<div class='company-connections-list link-list'>");
            _ref = this.company_connections;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              contact = _ref[i];
              if (!(i < this.limit)) {
                continue;
              }
              $o.push("  <div class='banner-link company-contact two-line' data-index='" + ($e($c(i))) + "' data-contact-name='" + ($e($c(contact.name))) + "' data-domain='" + ($e($c(this.domain))) + "' data-linkedin-url='http://www.google.com/search?q=" + ($e($c(contact.name))) + "+" + ($e($c(this.company_name))) + "+" + ($e($c(this.domain))) + "'>\n    <span class='link-actions pull-right'>");
              if (contact.email_status) {
                if (contact.email_status === "GUESSING") {
                  $o.push("      <span>\n        " + contact.email_status_message + "\n      </span>");
                } else {
                  $o.push("      <a class='contact-link email-link' href='mailto:" + ($e($c(contact.email))) + "' target='_blank'>\n        " + contact.email + "\n      </a>");
                }
              } else {
                $o.push("      <a class='contact-link email-action' href='#'>\n        Email\n      </a>");
              }
              if (this.has_salesforce) {
                $o.push("      <span class='divider hide-on-save'>\n        ·\n      </span>\n      <a class='add-contact-link hide-on-save muted no-highlight' href='#' target='_blank'>\n        Add\n      </a>\n      <a class='add-contact-link cancel-edit hide-on-save muted on-highlight' href='#' target='_blank'>\n        Cancel\n      </a>");
              }
              $o.push("    </span>\n    <a class='contact-link external-link view-linkedin-action' href='http://www.google.com/search?q=" + ($e($c(contact.name))) + "+" + ($e($c(this.company_name))) + "+" + ($e($c(this.domain))) + "' target='_blank' title='" + ($e($c(contact.name))) + "' alt='" + ($e($c(contact.name))) + "'>\n      <div class='contact-data'>\n        <span class='contact-name'>");
              if (contact.name) {
                $o.push("          " + contact.name);
              } else {
                $o.push("          " + contact.email);
              }
              $o.push("        </span>\n      </div>\n    </a>\n    <div class='contact-title link-subtext' alt='" + ($e($c(contact.title))) + "' title='" + ($e($c(contact.title))) + "'>\n      <span class='pull-right record-date'>\n        " + contact.last_touch + "\n      </span>");
              if (contact.owner_email) {
                $o.push("      <span class='owner-email'>\n        " + contact.owner_email + "\n      </span>");
              }
              $o.push("    </div>\n  </div>");
            }
            $o.push("</div>");
          } else {
            $o.push("<div class='link-list-header view-company-connections'>\n  <h4 class='muted'>\n    No Company Connections\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='No connections found at " + ($e($c(this.company_name))) + ". Invite more colleagues to discover connections.'></i>\n  </h4>\n  <!-- %i.icon-caret-up.pull-right.icon-fixed-width -->\n</div>");
          }
        } else {
          $o.push("<div class='link-list-header view-company-connections'>\n  <h4 class='muted'>\n    Connections\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Contacts at " + ($e($c(this.company_name))) + " that are connected to your colleagues'></i>\n    <span class='muted pull-right'>\n      Searching...\n    </span>\n  </h4>\n</div>");
        }
      } else {
        $o.push("<div class='link-list-header view-company-connections'>\n  <h4>\n    <strong>\n      Email Connections\n    </strong>\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Contacts at " + ($e($c(this.company_name))) + " that are connected to your colleagues'></i>\n    <span class='muted pull-right'>\n      Off\n    </span>\n  </h4>\n</div>\n<div class='company-connections-list link-list'>\n  <div class='muted notice'>\n    Find connections\n    <span class='divider'>\n      ·\n    </span>\n    <a class='connect-inbox-link external-link' href='" + ($e($c(window.api_base))) + "/facsimile/v1/oauth/start' target='_blank'>\n      <strong>\n        Link your Inbox\n      </strong>\n    </a>\n  </div>\n</div>");
      }
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['company_contacts_table'] = function(context) {
    return (function() {
      var $c, $e, $o, contact, department, i, _i, _j, _len, _len1, _ref, _ref1;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      if (this.company_contacts) {
        if (this.company_contacts.length > 0) {
          $o.push("<div class='view-company-contacts link-list-header" + (!this.limited ? " expanded" : "") + (this.has_avatars ? " has-avatars" : "") + "'>\n  <h4>\n    <strong>\n      Company Contacts\n    </strong>\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Contacts that are likely employed at " + ($e($c(this.company_name))) + "'></i>\n    <span class='link-actions pull-right'>");
          if (this.small_company) {
            if (this.limited && this.company_contacts.length > this.limit) {
              $o.push("      <a class='expand-link' href='#'>\n        Show More\n      </a>");
            }
          } else {
            $o.push("      <select class='filter-type' name='filter-role' dir='rtl'>");
            if (this.role === '') {
              $o.push("        <option value='' selected='" + ($e($c(this.role === '' ? "selected" : false))) + "'>\n          Filter\n        </option>");
            } else {
              $o.push("        <option value='' selected='" + ($e($c(false))) + "'>\n          Collapse\n        </option>");
            }
            _ref = this.department_buckets;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              department = _ref[_i];
              if (this.all_company_contacts[department.type] && this.all_company_contacts[department.type].length > 0) {
                $o.push("        <option value='" + ($e($c(department.type))) + "' selected='" + ($e($c(this.role === department.type ? "selected" : false))) + "'>\n          " + department.label + "\n        </option>");
              }
            }
            $o.push("        <option value='CUSTOM' selected='" + ($e($c(this.role === 'CUSTOM' ? "selected" : false))) + "'>\n          Custom\n        </option>\n      </select>\n      <i class='icon-sort-down'></i>");
          }
          $o.push("    </span>\n    <!-- %i.icon-people.icon-fixed-width.pull-right -->\n  </h4>\n</div>\n<div class='company-contacts-list link-list'>\n  <div class='search-container' style='display:none;'>\n    <div class='row-fluid span12'>\n      <input class='role-search-term span10' type='text' placeholder='Department/Role'>\n      <a class='banner-button button button-icon real-button search-role-button secondary-button span2' href='#'>\n        <i class='icon-search'></i>\n      </a>\n    </div>\n  </div>\n  <div class='find-contact-container'>\n    <div class='row-fluid span12'>\n      <input class='name-search-term span10' type='text' placeholder='Find By Name'>\n      <a class='accented-button banner-button button button-icon real-button search-name-button span2' href='#'>\n        <i class='icon-search'></i>\n      </a>\n    </div>\n  </div>");
          _ref1 = this.company_contacts;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            contact = _ref1[i];
            if (!(i < this.limit)) {
              continue;
            }
            $o.push("  <div class='banner-link company-contact two-line' data-index='" + ($e($c(i))) + "' data-contact-name='" + ($e($c(contact.name))) + "' data-domain='" + ($e($c(this.domain))) + "' data-linkedin-url='http://www.google.com/search?q=" + ($e($c(contact.name))) + "+" + ($e($c(this.company_name))) + "+" + ($e($c(this.domain))) + "'>");
            if (this.has_avatars) {
              if (contact.avatar_url) {
                $o.push("    <img class='contact-avatar' src='" + ($e($c(contact.avatar_url))) + "'>");
              } else {
                $o.push("    <img class='contact-avatar' src='" + ($e($c(window.server_base))) + "/avatar/image/?domain=" + ($e($c(this.domain))) + "'>");
              }
            }
            $o.push("    <span class='link-actions pull-right'>");
            if (contact.email_status || contact.calculated_email) {
              if (contact.email_status === "ERROR") {
                $o.push("      <span class='error'>\n        " + contact.email_status_message + "\n      </span>");
              } else if (contact.email_status === "GUESSING") {
                $o.push("      <span>\n        " + contact.email_status_message + "\n      </span>");
              } else if (contact.email_status === "UPGRADE") {
                $o.push("      <span>\n        &nbsp;\n      </span>");
              } else {
                $o.push("      <a class='contact-link email-link' href='mailto:" + ($e($c(contact.calculated_email))) + "' target='_blank'>\n        <span class='guessing'>\n          " + contact.calculated_email + "\n        </span>\n      </a>");
              }
            } else {
              $o.push("      <a class='contact-link email-action' href='#'>\n        Guess Email\n      </a>");
            }
            if (this.has_salesforce || this.has_hubspot) {
              $o.push("      <span class='divider hide-on-save'>\n        ·\n      </span>\n      <a class='add-contact-link hide-on-save muted no-highlight' href='#' target='_blank'>\n        Add\n      </a>\n      <a class='add-contact-link cancel-edit hide-on-save muted on-highlight' href='#' target='_blank'>\n        Cancel\n      </a>");
            }
            $o.push("    </span>\n    <a class='contact-link external-link view-linkedin-action' href='http://www.google.com/search?q=" + ($e($c(contact.name))) + "+" + ($e($c(this.company_name))) + "+" + ($e($c(this.domain))) + "' target='_blank' title='" + ($e($c(contact.name))) + "' alt='" + ($e($c(contact.name))) + "'>\n      <div class='contact-data'>\n        <span class='contact-name'>\n          " + contact.name + "\n        </span>\n      </div>\n    </a>\n    <div class='contact-title link-subtext' alt='" + ($e($c(contact.title))) + "' title='" + ($e($c(contact.title))) + "'>");
            if (contact.title) {
              $o.push("      " + contact.title);
            }
            $o.push("    </div>");
            if (contact.email_status && contact.email_status === "UPGRADE") {
              $o.push("    <div class='link-subtext success'>\n      <i class='icon-info-sign'></i>\n      " + contact.email_status_message + "\n    </div>");
            }
            $o.push("  </div>");
          }
          $o.push("</div>");
        } else {
          $o.push("<div class='link-list-header view-company-contacts'>\n  <h4 class='muted'>\n    No Company Contacts\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='No contacts found at " + ($e($c(this.company_name))) + "'></i>\n  </h4>\n</div>\n<div class='company-contacts-list link-list'>\n  <div class='find-contact-container'>\n    <div class='row-fluid span12'>\n      <input class='name-search-term span10' type='text' placeholder='Find By Name'>\n      <a class='accented-button banner-button button button-icon real-button search-name-button span2' href='#'>\n        <i class='icon-search'></i>\n      </a>\n    </div>\n  </div>\n  <!-- %i.icon-caret-up.pull-right.icon-fixed-width -->\n</div>");
        }
      } else {
        $o.push("<div class='link-list-header view-company-contacts'>\n  <h4 class='muted'>\n    Company Contacts\n    <span class='muted pull-right'>\n      Searching...\n    </span>\n  </h4>\n</div>");
      }
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['data_table'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='link-list'>\n  <div class='visible-properties'></div>\n  <div class='social-properties'></div>\n  <div class='hidden-properties'></div>\n  <div class='overview'></div>\n</div>\n<div class='crm-controls'>\n  <a class='hide button banner-button real-button primary-button input-block-level add-to-crm' href='#'>\n    Add to");
      if (this.has_hubspot) {
        $o.push("    HubSpot");
      } else if (this.has_salesforce) {
        $o.push("    Salesforce");
      }
      $o.push("    <i class='icon-plus-sign pull-right'></i>\n  </a>\n  <a class='hide button banner-button real-button crm-button existing-button input-block-level view-in-crm' href='#' target='_blank'>\n    View in CRM\n    <i class='icon-chevron-right pull-right'></i>\n  </a>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['existing_records_table'] = function(context) {
    return (function() {
      var $c, $e, $o, record, record_type, records, visible_item, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      if (this.formatted_existing_records && this.crm_base_url) {
        if (this.existing_records_length > 0) {
          $o.push("<div class='view-existing-records link-list-header" + (!this.limited ? " expanded" : "") + "'>\n  <h4>\n    <strong>\n      " + (this.existing_records.get('record_set_type')) + " Records\n    </strong>\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Existing " + ($e($c(this.existing_records.get('record_set_type')))) + " records for " + ($e($c(this.company_name))) + "'></i>\n    <a class='expand-link pull-right' href='#'>");
          if (this.existing_records_length > this.limit) {
            $o.push("      <span class='collapsed expand-text'>\n        See all " + this.existing_records_length + "\n      </span>");
          }
          $o.push("      <span class='expand-text expanded'>\n        See less\n      </span>\n    </a>\n    <!-- %i.icon-salesforce.icon-fixed-width.pull-right -->\n  </h4>\n</div>\n<div class='existing-records-list link-list'>");
          visible_item = 0;
          _ref = this.formatted_existing_records;
          for (record_type in _ref) {
            records = _ref[record_type];
            if (visible_item < this.limit) {
              for (_i = 0, _len = records.length; _i < _len; _i++) {
                record = records[_i];
                if (!(visible_item < this.limit)) {
                  continue;
                }
                visible_item = visible_item + 1;
                $o.push("  <div class='existing-record banner-link two-link " + record_type + "-record' data-id='" + ($e($c(record.id))) + "'>");
                if (record_type === 'lead' && this.existing_records.get('record_set_type') === 'Salesforce') {
                  $o.push("    <span class='link-actions pull-right'>");
                  if (record.owner_name && record.owned_by_queue) {
                    $o.push("      <a class='claim-record-action existing-record-link' href='#' target='_blank'>\n        Claim\n      </a>\n      <span class='claiming-status existing-record-link muted'>\n        Claiming...\n      </span>\n      <span class='claimed-success existing-record-link success'>\n        <i class='icon-ok-sign'></i>\n        Claimed\n      </span>\n      <span class='claimed-error error existing-record-link'>\n        <i class='icon-remove-sign'></i>\n        Error\n      </span>\n      <span class='divider'>\n        ·\n      </span>");
                  }
                  $o.push("      <a class='edit-record-action existing-record-link hide-on-save no-highlight' href='#' target='_blank'>\n        Edit\n      </a>\n      <a class='cancel-edit edit-record-action existing-record-link hide-on-save muted on-highlight' href='#' target='_blank'>\n        Cancel\n      </a>\n    </span>");
                }
                $o.push("    <a class='existing-record-link external-link view-record-action' href='" + ($e($c(this.crm_base_url))) + "/" + ($e($c(record.id))) + "' target='_blank'>\n      <div class='contact-data'>\n        <span class='contact-name'>");
                if (record.name) {
                  $o.push("          " + record.name);
                } else {
                  if (record.first_name || record.last_name) {
                    if (record.first_name) {
                      $o.push("          " + record.first_name);
                    }
                    if (record.last_name) {
                      $o.push("          " + record.last_name);
                    }
                  } else {
                    if (record.email) {
                      $o.push("          " + record.email);
                    } else {
                      $o.push("          <span class='muted'>\n            " + record.company_name + "\n          </span>");
                    }
                  }
                }
                $o.push("        </span>\n      </div>\n    </a>");
                if (record.owner_name || record.date) {
                  $o.push("    <div class='contact-title link-subtext' alt='" + ($e($c(record.owner_name))) + "' title='" + ($e($c(record.owner_name))) + "'>");
                  if (record.date && record.date !== 'undefined') {
                    $o.push("      <span class='pull-right record-date'>\n        " + record.date + "\n      </span>");
                  }
                  $o.push("      <span class='record-owner'>\n        " + (record.record_type[0].toUpperCase() + record.record_type.slice(1)));
                  if (record.owner_name) {
                    $o.push("        &bull; " + record.owner_name);
                  }
                  $o.push("      </span>\n    </div>");
                }
                $o.push("  </div>");
              }
            }
          }
          $o.push("</div>");
        } else {
          if (this.salesforce_error_message) {
            $o.push("<div class='link-list-header view-existing-records'>\n  <h4 class='error'>\n    <strong>\n      Salesforce Records\n    </strong>\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Existing Salesforce records for " + ($e($c(this.company_name))) + "'></i>\n  </h4>\n</div>\n<div class='existing-records-list link-list'>\n  <div class='error notice'>\n    <i class='icon-remove-sign'></i>\n    " + this.salesforce_error_message + "\n    <span class='divider'>\n      ·\n    </span>\n    <a class='external-link fix-salesforce-link' href='/settings#salesforce' target='_blank'>\n      <strong>\n        Fix\n      </strong>\n      <i class='icon-external-link'></i>\n    </a>\n  </div>\n</div>");
          }
        }
      } else {
        if (this.salesforce_error_message) {
          $o.push("<div class='link-list-header view-existing-records'>\n  <h4 class='error'>\n    <strong>\n      CRM Records\n    </strong>\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Existing Salesforce records for " + ($e($c(this.company_name))) + "'></i>\n  </h4>\n</div>\n<div class='existing-records-list link-list'>\n  <div class='error notice'>\n    <i class='icon-remove-sign'></i>\n    " + this.salesforce_error_message + "\n    <span class='divider'>\n      ·\n    </span>\n    <a class='external-link fix-salesforce-link' href='/settings#salesforce' target='_blank'>\n      Fix\n      <i class='icon-external-link'></i>\n    </a>\n  </div>\n</div>");
        }
      }
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['header_company'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      if (this.is_child_view) {
        $o.push("<div class='expand-container'>\n  <i class='icon-double-angle-up'></i>\n</div>");
      }
      $o.push("<img class='company-avatar' src='" + ($e($c(window.server_base))) + "/avatar/image/?domain=" + ($e($c(this.domain))) + "'>\n<div class='primary-data'>\n  <div class='company-name primary-name' alt='" + ($e($c(this.company_name))) + "' title='" + ($e($c(this.company_name))) + "'>\n    " + this.company_name + "\n  </div>\n  <div class='secondary-name'>\n    <a class='external-link muted-link' href='http://" + ($e($c(this.domain))) + "' target='_blank'>\n      " + this.domain + "\n      <i class='icon-external-link'></i>\n    </a>\n  </div>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['header_contact'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<img class='header-contact-avatar' src='" + ($e($c(this.avatar_url))) + "'>\n<div class='primary-data'>\n  <div class='contact-name primary-name'></div>\n  <div class='secondary-name'></div>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['hidden_properties'] = function(context) {
    return (function() {
      var $c, $e, $o, i, property, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='data-row show-more-row'>\n  <div class='data-col'>");
      if (this.has_salesforce) {
        $o.push("    <a class='external-link muted-link show-more' href='#'>\n      More\n      <i class='icon-caret-down'></i>\n    </a>");
      } else {
        $o.push("    <a class='external-link muted-link show-more' href='#'>\n      More\n      <i class='icon-caret-down'></i>\n    </a>");
      }
      $o.push("  </div>\n  <div class='data-col'>\n    &nbsp;\n  </div>\n</div>\n<div class='detailed-data'>");
      _ref = this.hidden_properties;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        property = _ref[i];
        if (!('rawvalue' in property && (property.rawvalue == null)) && property.value && property.value !== "null" && property.value !== "None") {
          $o.push("  <div class='data-row'>");
          if (property.link) {
            $o.push("    <div class='data-col'>\n      " + property.label + "\n    </div>\n    <div class='data-col'>\n      <a class='external-link muted-link' href='" + ($e($c(property.link))) + "' target='_blank'>\n        " + property.value + "\n        <i class='icon-external-link'></i>\n      </a>\n    </div>");
          } else {
            $o.push("    <div class='data-col'>\n      " + property.label + "\n    </div>\n    <div class='data-col'>\n      " + property.value + "\n    </div>");
          }
          $o.push("  </div>");
        }
      }
      $o.push("</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['overview'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<a class='banner-link expandable lead-overview' href='#'>\n  " + this.overview + "\n</a>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['related_companies_table'] = function(context) {
    return (function() {
      var $c, $e, $o, company, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      if (this.related_companies) {
        if (this.related_companies.length > 0) {
          $o.push("<div class='link-list-header view-related-companies'>\n  <h4>\n    <strong>\n      Related Companies\n    </strong>\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Companies that may be related to " + ($e($c(this.company_name))) + "'></i>\n  </h4>\n</div>\n<div class='link-list related-companies-list'>");
          _ref = this.related_companies;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            company = _ref[_i];
            $o.push("  <div class='banner-link related-company' data-domain='" + ($e($c(company.domain))) + "' data-company-name='" + ($e($c(company.name))) + "'>\n    <a class='related-company-link' href='" + ($e($c(company.domain))) + "' target='_blank'>\n      " + company.name + "\n    </a>\n  </div>");
          }
          $o.push("</div>");
        } else {
          $o.push("<div class='link-list-header view-related-companies'>\n  <h4 class='muted'>\n    No Related Companies\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title=\"We couldn't find any companies related to " + ($e($c(this.company_name))) + "\"></i>\n  </h4>\n</div>\n<div class='empty-list link-list related-companies-list'></div>");
        }
      } else {
        $o.push("<div class='link-list-header view-related-companies'>\n  <h4 class='muted'>\n    Related Companies\n    <i class='icon-question-sign tippable' data-toggle='tooltip' data-placement='bottom' data-original-title='Companies that may be related to " + ($e($c(this.company_name))) + "'></i>\n    <span class='muted pull-right'>\n      Searching...\n    </span>\n  </h4>\n</div>");
      }
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['signals_activities_table'] = function(context) {
    return (function() {
      var $c, $e, $o, activity, i, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      if (this.activities) {
        if (this.activities.length > 0) {
          $o.push("<div class='signals-activities-list link-list" + (!this.is_user_profile ? " contact-timeline-list" : "") + "'>");
          _ref = this.activities;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            activity = _ref[i];
            if (!(i < this.limit)) {
              continue;
            }
            $o.push("  <div class='banner-link signals-activity three-line' data-index='" + ($e($c(i))) + "' data-contact-name='#' data-domain='#' data-linkedin-url='#'>");
            if (this.is_user_profile) {
              $o.push("    <div class='activity-bubble-avatar'>");
              if (activity.computed_avatar_url) {
                $o.push("      <img class='contact-avatar' src='" + ($e($c(activity.computed_avatar_url))) + "'>");
              } else {
                $o.push("      <img class='contact-avatar' src='" + ($e($c(window.server_base))) + "/avatar/image/?email=" + ($e($c(activity.computed_email))) + "'>");
              }
              if (activity.icon === "icon-envelope") {
                $o.push("      <div class='activity-bubble emailopen-bubble'>\n        <i class='icon-envelope'></i>\n      </div>");
              } else if (activity.icon === "icon-link") {
                $o.push("      <div class='activity-bubble linkclick-bubble'>\n        <i class='icon-link'></i>\n      </div>");
              } else if (activity.icon === "icon-salesforce") {
                $o.push("      <div class='activity-bubble salesforce-bubble'>\n        <i class='icon-salesforce'></i>\n      </div>");
              } else if (activity.icon === "icon-sprocket") {
                $o.push("      <div class='activity-bubble hubspot-bubble'>\n        <i class='icon-sprocket'></i>\n      </div>");
              } else if (activity.icon === "icon-play") {
                $o.push("      <div class='activity-bubble hubspot-bubble'>\n        <i class='icon-play'></i>\n      </div>");
              }
              $o.push("    </div>");
            } else {
              $o.push("    <div class='activity-bubble-container'>");
              if (activity.icon === "icon-envelope") {
                $o.push("      <div class='activity-bubble emailopen-bubble'>\n        <i class='icon-envelope'></i>\n      </div>");
              } else if (activity.icon === "icon-link") {
                $o.push("      <div class='activity-bubble linkclick-bubble'>\n        <i class='icon-link'></i>\n      </div>");
              } else if (activity.icon === "icon-salesforce") {
                $o.push("      <div class='activity-bubble salesforce-bubble'>\n        <i class='icon-salesforce'></i>\n      </div>");
              } else if (activity.icon === "icon-sprocket") {
                $o.push("      <div class='activity-bubble hubspot-bubble'>\n        <i class='icon-sprocket'></i>\n      </div>");
              } else if (activity.icon === "icon-play") {
                $o.push("      <div class='activity-bubble hubspot-bubble'>\n        <i class='icon-play'></i>\n      </div>");
              }
              $o.push("    </div>");
            }
            $o.push("    <div class='activity-meta'>");
            if (this.is_user_profile) {
              if (activity.computed_email) {
                $o.push("      <a class='contact-link external-link view-contact-action' href='#' title='" + ($e($c(activity.name))) + "' alt='" + ($e($c(activity.name))) + "' data-name='" + ($e($c(activity.name))) + "' data-email='" + ($e($c(activity.computed_email))) + "'>\n        <div class='contact-data'>\n          <span class='contact-name'>\n            " + activity.name + "\n          </span>\n        </div>\n      </a>");
              } else {
                $o.push("      <div class='contact-data'>\n        <span class='contact-name'>\n          " + activity.name + "\n        </span>\n      </div>");
              }
              $o.push("      <div class='contact-title link-subtext'>\n        <span class='owner-email'>\n          " + activity.story + "\n        </span>\n      </div>\n      <div class='link-subtext third-line'>\n        <span class='record-date'>\n          " + (moment(parseInt(activity.created, 10)).fromNow()) + "\n        </span>\n      </div>");
            } else {
              $o.push("      <span class='contact-link view-linkedin-action'>\n        <div class='contact-data'>\n          <span class='activity-story'>\n            " + activity.story + "\n          </span>\n        </div>\n      </span>\n      <div class='link-subtext'>\n        <span class='record-date'>\n          " + (moment(parseInt(activity.created, 10)).fromNow()) + "\n        </span>\n      </div>");
            }
            $o.push("    </div>\n  </div>");
          }
          $o.push("</div>");
        }
      }
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['social_properties'] = function(context) {
    return (function() {
      var $c, $e, $o, i, property, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      if (this.social_properties) {
        $o.push("<div class='data-row social-row'>");
        _ref = this.social_properties;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          property = _ref[i];
          if (property.iconname) {
            if (property.email) {
              $o.push("  <a class='email-link external-link muted-link' href='" + ($e($c(property.link))) + "'>\n    <i class='" + property.iconname + "'></i>\n  </a>");
            } else {
              $o.push("  <a class='external-link muted-link' href='" + ($e($c(property.link))) + "' target='_blank'>\n    <i class='" + property.iconname + "'></i>\n  </a>");
            }
          }
        }
        $o.push("</div>");
      }
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['social_streams_container'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='stream-heading-container'>\n  <div class='hide stream-heading' data-stream-type='signals'>\n    <i class='icon-fixed-width icon-signals'></i>\n  </div>\n  <div class='hide stream-heading' data-stream-type='twitter'>\n    <i class='icon-fixed-width icon-twitter'></i>\n  </div>\n  <div class='other-social-links'></div>\n</div>\n<div class='stream-container'>\n  <div class='hide social-stream' data-stream-type='signals'></div>\n  <div class='hide social-stream' data-stream-type='twitter'></div>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['twitter_timeline'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<a class='twitter-timeline' href='https://twitter.com/" + ($e($c(this.twitter_name))) + "' data-screen-name='" + ($e($c(this.twitter_name))) + "' data-widget-id='" + ($e($c(this.widget_id))) + "' data-tweet-limit='" + ($e($c(this.limit))) + "'></a>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  if (window.HAML == null) {
    window.HAML = {};
  }

  window.HAML['visible_properties'] = function(context) {
    return (function() {
      var $c, $e, $o, i, property, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      _ref = this.visible_properties;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        property = _ref[i];
        if (!('rawvalue' in property && (property.rawvalue == null)) && property.value && property.value !== "null" && property.value !== "None") {
          $o.push("<div class='data-row' data-row-type='" + ($e($c(property.label))) + "'>");
          if (property.link) {
            $o.push("  <div class='data-col data-col-label'>\n    " + property.label + "\n  </div>\n  <div class='data-col'>\n    <a class='external-link muted-link' href='" + ($e($c(property.link))) + "' target='_blank'>\n      <span class='data-col-value'>\n        " + property.value + "\n      </span>\n      <i class='icon-external-link'></i>\n    </a>\n  </div>");
          } else {
            $o.push("  <div class='data-col data-col-label'>\n    " + property.label + "\n  </div>\n  <div class='data-col data-col-value'>\n    " + property.value + "\n  </div>");
          }
          $o.push("</div>");
        }
      }
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);
