<?php
    $title = get_bloginfo('name');
    $description = get_bloginfo('description');
    $url = get_bloginfo('url');
    $theme_dir = get_bloginfo('template_directory');
    $image = $logo_image = $theme_dir.'/dist/images/logo.svg';

    if(is_single()){
        $id = get_the_ID();
        $thumb_id = get_post_thumbnail_id($id);
        if($thumb_id){
            $thumb_url = wp_get_attachment_image_src($thumb_id, 'open-graph', true);
            $image = $url.$thumb_url[0];
        }
        $title = get_the_title();
    }

    if((is_archive()||(is_category()))){

    }

?>

<meta property="og:title" content="<?= $title ?>"/>
<meta property="og:description" content="<?= $description ?>"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="<?= $image ?>" />
<meta property="og:image:width" content="200" />
<meta property="og:image:height" content="200" />
<meta property="og:url" content="<? the_permalink(); ?>" />
<meta name="title" content="<?= $title ?>"/>
<meta name="logo" content="<?= $logo_image ?>" />
<link rel="image_src" href="<?= $logo_image ?>" />