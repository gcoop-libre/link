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
