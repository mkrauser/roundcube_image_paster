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
 * @version 0.1a
 * @date    2013-12-10
 * @license GPL
 *
 */
class image_paster extends rcube_plugin
{

  public $task = 'mail';

  function init()
  {
    $this->add_hook('render_page', array($this, 'compose'));
    $this->register_action('plugin.uploadClipboardImage', array($this, 'handleUpload'));
  }

  /**
   * add a fileapi implementation to the compose template
   */
  function compose($args)
  {
    // find the compose template
    if ($args['template'] == 'compose')
    {
      $this->include_script('image_paster.js');
    }
    return $args;
  }
}