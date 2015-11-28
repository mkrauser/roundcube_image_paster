<?php

/**
 * Roundcube-Plugin to paste images directly from clipboard
 *
 * A the time of writing this only works in google chrome
 *
 * For now, this is only a proof-of-concept, there a many hacks in the code
 * If you have any hints or suggestions, feel free to contact me.
 *
 * @author  Matthias Krauser <matthias@krauser.eu> @mat_krauser
 * @date    2013-12-10
 * @license GPL
 *
 */
class image_paster extends rcube_plugin
{

  public $task = 'mail';

  function init()
  {
    $this->add_hook('html_editor', [$this, 'html_editor']);
    $this->add_hook('render_page', [$this, 'compose']);
    $this->register_action('plugin.uploadClipboardImage', [$this, 'handleUpload']);
  }

  /**
   * add a fileapi implementation to the compose template
   */
  function compose($args)
  {
    if ($args['template'] == 'compose') {
      $this->include_script('image_paster.js');
    }
    return $args;
  }

  /**
   * add a fileapi implementation to the compose template
   */
  function html_editor($args)
  {
    $args['extra_plugins'][] = 'image_paster';

    return $args;
  }
}