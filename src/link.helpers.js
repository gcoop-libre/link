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
