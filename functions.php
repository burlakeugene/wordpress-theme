<?php
if (!function_exists('burlak_setup')) :
  function burlak_setup()
  {
    load_theme_textdomain('burlak', get_template_directory() . '/languages');
    add_theme_support('automatic-feed-links');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus(array(
      'header' => esc_html__('Header', 'burlak'),
      'footer' => esc_html__('Footer', 'burlak'),
      'slidebar' => esc_html__('Slidebar', 'burlak')
    ));
  }
endif;
add_action('after_setup_theme', 'burlak_setup');
function burlak_scripts()
{
  wp_enqueue_style('burlak-style', get_stylesheet_uri());
  wp_enqueue_script('burlak-bundle', get_template_directory_uri() . '/dist/js/bundle.js');
  wp_enqueue_style('burlak-theme', get_template_directory_uri() . '/dist/css/main.css');
}
add_action('wp_enqueue_scripts', 'burlak_scripts');
show_admin_bar(false);

function add_fancybox($content)
{
  global $post;
  $pattern = "/<a(.*?)href=('|\")(.*?).(bmp|gif|jpeg|jpg|png)('|\")(.*?)>/i";
  $replacement = '<a$1href=$2$3.$4$5 data-fancybox="%POSTID%"$6>';
  $content = preg_replace($pattern, $replacement, $content);
  $content = str_replace("%POSTID%", $post->ID, $content);
  return $content;
}

add_filter('the_content', 'add_fancybox');

function phone_replace($string)
{
  $string = str_replace(" ", "", $string);
  $string = str_replace("-", "", $string);
  $string = str_replace("(", "", $string);
  $string = str_replace(")", "", $string);
  return $string;
}
function generate_youtube($atts)
{
  $atts = shortcode_atts(array(
    'src'   => 'A3nEH-cqwE4',
    'height' => '450px',
    'width'  => '100%',
  ), $atts);
  return '<iframe src="' . $atts['src'] . '" width="100%" height="' . $atts['height'] . '" frameborder="0" allowfullscreen> <p>Your Browser does not support Iframes.</p></iframe>';
}

add_image_size('lazy', 50, 50, false);
add_image_size('lazy-square', 50, 50, true);

function getMonth($month)
{
  $months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  return $months[$month - 1];
}

function devise_number_displayed_posts($query)
{
  if (!is_admin() && is_post_type_archive('gallery')) {
    $query->set('posts_per_page', -1);
    return;
  }
  if (!is_admin() && is_post_type_archive('articles')) {
    $query->set('posts_per_page', 8);
    return;
  }
}
add_action('pre_get_posts', 'devise_number_displayed_posts', 1);

add_action('admin_menu', function () {
  add_options_page('Theme settings page', 'Theme settings', 'manage_options', 'theme-page', 'theme_settings_page');
});

add_action('admin_init', function () {
  register_setting('theme-page-settings', 'common_scripts');
  register_setting('theme-page-settings', 'head_additions');
  register_setting('theme-page-settings', 'copyrights');
  register_setting('theme-page-settings', 'address');
  register_setting('theme-page-settings', 'phone');
  register_setting('theme-page-settings', 'theme-color');
});

function theme_settings_page()
{
  ?>
  <div class="wrap theme-settings">
    <h1>Theme settings</h1>
    <form action="options.php" method="post">
      <?php
        settings_fields('theme-page-settings');
        do_settings_sections('theme-page-settings');
        ?>
      <label>
        <div>Common scripts</div>
        <textarea name="common_scripts"><?= esc_attr(get_option('common_scripts')); ?></textarea>
      </label>
      <label>
        <div>Head additions</div>
        <textarea name="head_additions"><?= esc_attr(get_option('head_additions')); ?></textarea>
      </label>
      <label>
        <div>Address</div>
        <input type="text" name="address" value="<?= esc_attr(get_option('address')) ?>" />
      </label>
      <label>
        <div>Copyrights</div>
        <input type="text" name="copyrights" value="<?= esc_attr(get_option('copyrights')) ?>" />
      </label>
      <label>
        <div>Phone</div>
        <input type="tel" name="phone" value="<?= esc_attr(get_option('phone')) ?>" />
      </label>
      <label>
        <div>Mail</div>
        <input type="email" name="mail" value="<?= esc_attr(get_option('mail')) ?>" />
      </label>
      <label>
        <div>Theme color</div>
        <input name="theme-color" type="text" value="<?= esc_attr(get_option('theme-color')); ?>">
      </label>
      <?php submit_button(); ?>
    </form>
  </div>
  <style>
    .theme-settings {
      max-width: 600px;
    }

    .theme-settings input {
      width: 100%;
    }

    .theme-settings input[type="checkbox"] {
      width: auto;
    }

    .theme-settings textarea {
      width: 100%;
      resize: none;
      height: 150px;
    }

    .theme-settings label {
      margin-bottom: 10px;
      display: block;
    }

    .theme-settings .submit {
      margin-top: 0;
    }

    .theme-settings input[type='submit'] {
      width: auto;
    }

    .theme-settings h1 {
      margin-bottom: 20px;
    }
  </style>
<?php
}

function my_get_template_part($template, $data = array())
{
  extract($data);
  require locate_template($template . '.php');
}

add_shortcode('tabs', function ($attrs) {
  $ids = $attrs && $attrs['ids'] ? $attrs['ids'] : false;
  $linksText = $attrs && $attrs['linkstext'] ? $attrs['linkstext'] : false;
  if ($linksText) $linksText = explode(',', $linksText);
  $linksHref = $attrs && $attrs['linkshref'] ? $attrs['linkshref'] : false;
  if ($linksHref) $linksHref = explode(',', $linksHref);
  $linksNewTab = $attrs && $attrs['linksnewtab'] ? $attrs['linksnewtab'] : false;
  if ($linksNewTab) $linksNewTab = explode(',', $linksNewTab);

  $links = array();

  foreach ($linksText as $key => $link) {
    array_push($links, array(
      "text" => $linksText[$key],
      "link" => $linksHref[$key] ? $linksHref[$key] : '#',
      "blank" => $linksNewTab[$key] ? true : false
    ));
  }

  if ($ids || $links) {
    ob_start();
    $ids = explode(',', $ids);
    my_get_template_part('tabs/shortcode', array(
      'ids' => $ids,
      'links' => $links
    ));
    return ob_get_clean();
  }
});
