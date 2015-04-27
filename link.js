/**
 * Implements hook_field_info_instance_add_to_form().
 */
function link_field_info_instance_add_to_form(entity_type, bundle, form, entity, element) {
  try {
    element.value_callback = 'link_field_value_callback';
  }
  catch (error) { console.log('link_field_info_instance_add_to_form - ' + error); }
}

/**
 * Implements hook_field_widget_form().
 */
function link_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    
    /*console.log(form);
    console.log(form_state);
    console.log(field);
    console.log(instance);
    console.log(items);
    console.log(element);*/

    // Change the element into a hidden input and utilize children to build the
    // widgets.
    items[delta].type = 'hidden';

    // Display the link title element, if necessary.
    var title = instance.settings.title;
    switch (title) {
      case 'optional':
      case 'required':
        items[delta].children.push({
            type: 'textfield',
            title: 'Title',
            attributes: {
              id: items[delta].id + '-title'
            }
        });
        if (title == 'required') {
          items[delta].children[0].required = true;
        }
        break;
      case 'value': // aka 'static' title
      case 'none':
        title = false;
        break;
    }

    // Display the URL element
    items[delta].children.push({
        type: 'textfield',
        title: 'URL',
        required: items[delta].required,
        attributes: {
          id: items[delta].id + '-url'
        }
    });
    
    // Any default values? First see if the field settings have a default value,
    // then depending on what widgets are enabled, show/hide elements/labels as
    // necessary. Then if the entity has an item value(s), use that instead,
    // then finally add the value(s) to the child(ren).
    var _title = null;
    var _url = null;
    if (instance.default_value) {
      var _title = instance.default_value[delta].title;
      var _url = instance.default_value[delta].url;
    }
    if (items[delta].item) {
      if (items[delta].item.title) { _title = items[delta].item.title; }
      if (items[delta].item.url) { _url = items[delta].item.url; }
    }
    if (title) {
      if (_title) {
        items[delta].children[0].attributes.value = _title;
      }
      if (_url) {
        items[delta].children[1].attributes.value = _url;
      }
    }
    else if (_url) {
      items[delta].children[0].title = null;
      items[delta].children[0].attributes.value = _url;
    }

  }
  catch (error) { console.log('hook_field_widget_form - ' + error); }
}

/**
 * A form state value callback.
 */
function link_field_value_callback(id, element) {
  try {
    var title = $('#' + id + '-title').length ? $('#' + id + '-title').val() : '';
    var url = $('#' + id + '-url').length ? $('#' + id + '-url').val() : '';
    var value = encodeURIComponent(title);
    if (!empty(title) && !empty(url)) { value += ','; }
    if (!empty(url)) { value += encodeURIComponent(url); }
    return value;
  }
  catch (error) { console.log('link_field_value_callback - ' + error); }
}

/**
 * Implements hook_assemble_form_state_into_field().
 */
function link_assemble_form_state_into_field(entity_type, bundle,
  form_state_value, field, instance, langcode, delta, field_key) {
  try {
    field_key.use_key = false;
    var value = {};
    if (form_state_value.indexOf(',') != -1) {
      var parts = form_state_value.split(',');
      value.title = decodeURIComponent(parts[0]);
      value.url = decodeURIComponent(parts[1]);
    }
    else { value.url = decodeURIComponent(form_state_value); }
    return value;
  }
  catch (error) { console.log('link_assemble_form_state_into_field - ' + error); }
}

/**
 * Implements hook_field_formatter_view().
 */
function link_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    var element = {};
    $.each(items, function(delta, item) {
        var title = item.title ? item.title : item.url
        element[delta] = {
          markup: theme(
            'button_link',
            { text: title, path: item.url, options: { InAppBrowser: true } }
          )
        };
    });
    return element;
  }
  catch (error) { console.log('link_field_formatter_view - ' + error); }
}

