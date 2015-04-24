/**
 * Implements hook_field_widget_form().
 */
function link_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    
    console.log(field);
    console.log(instance);
    console.log(items);
    console.log(element);

    // Change the element into a hidden input and utilize children to build the
    // widgets.
    items[delta].type = 'hidden';

    // Display the link title element as an element child, if necessary.
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
    // necessary.
    var _title = null;
    var _url = null;
    if (instance.default_value) {
      var _title = instance.default_value[delta].title;
      var _url = instance.default_value[delta].url;
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
 * Implements hook_field_formatter_view().
 */
function link_field_formatter_view(entity_type, entity, field, instance, langcode, items, display) {
  try {
    //dpm(items);
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
