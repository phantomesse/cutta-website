<?php
/*
Plugin Name: Language Manager
Version: 1.0
Author: Lauren Zou
*/

$default_language_spreadsheet_key = '0Ao1eaDOso45tdG1PNEJ5N2JxdjdJZWVDVVFXMWplbFE';

function update_languages() {
    $main_directory = get_template_directory().'/';
    $language_spreadsheet_url = 'http://cors.io/spreadsheets.google.com/feeds/list/'.$default_language_spreadsheet_key.'/od6/public/values?alt=json';

    // Get contents of the language spreadsheet in a json array
    $language_spreadsheet_json = json_decode(file_get_contents($language_spreadsheet_url), true);
    
    // Check if there had been any changes
    $last_updated_new = $language_spreadsheet_json['feed']['updated']['$t'];
    $last_updated_file = $main_directory.'strings/last_updated';
    if (file_exists($last_updated_file)) {
        $last_updated_old = file_get_contents($last_updated_file);
        if ($last_updated_old == $last_updated_new) {
            return 'Languages at most current revision.';
        }
    }

    // Parse entries into $languages_json
    $entries = $language_spreadsheet_json['feed']['entry'];
    $languages_json = array();
    foreach($entries as $entry) {
        $languages_json = parse_entry($languages_json, $entry);
    }

    // Export each language array as a json file
    foreach($languages_json as $language => $language_json) {
        file_put_contents($main_directory.'strings/lang.'.$language.'.js', pretty_print_json(json_encode($languages_json[$language])));
    }

    // Update or create last updated file
    file_put_contents($last_updated_file, $last_updated_new);

    return 'All languages are now updated to the latest revision!';
}

function parse_entry($languages_json, $entry) {
    // Get all fields that start with gsx and parse them. This is the data we care about.
    $key = array();
    $language_strings = array();
    foreach($entry as $entry_key => $entry_value) {
        if (substr($entry_key, 0, 4) == 'gsx$') {
            if ($entry_key == 'gsx$key') {
                // Get key
                $key = explode('.', $entry_value['$t']);
            } else {
                // Get language strings
                $language = substr($entry_key, strlen($entry_key) - 2, 2);
                $language_strings[$language] = $entry_value['$t'];
            }
        }
    }

    // Iterate through each language
    foreach($language_strings as $language => $language_string) {
        // Check if $languages_json has this language yet
        if (!isset($languages_json[$language])) {
            $languages_json[$language] = array();
        }

        // Add the language string into the appropriate language
        $pointer = &$languages_json[$language];
        for ($i = 0; $i < count($key) - 1; $i++) {
            $key_part = $key[$i];
            if (!isset($pointer[$key_part])) {
                $pointer[$key_part] = array();
            }
            $pointer = &$pointer[$key_part];
        }
        $pointer[$key[count($key) - 1]] = $language_string;
    }

    return $languages_json;
}

/* Function from http://stackoverflow.com/questions/6054033/pretty-printing-json-with-php */
function pretty_print_json($json) {
    $result = '';
    $level = 0;
    $in_quotes = false;
    $in_escape = false;
    $ends_line_level = NULL;
    $json_length = strlen( $json );

    for( $i = 0; $i < $json_length; $i++ ) {
        $char = $json[$i];
        $new_line_level = NULL;
        $post = "";
        if( $ends_line_level !== NULL ) {
            $new_line_level = $ends_line_level;
            $ends_line_level = NULL;
        }
        if ( $in_escape ) {
            $in_escape = false;
        } else if( $char === '"' ) {
            $in_quotes = !$in_quotes;
        } else if( ! $in_quotes ) {
            switch( $char ) {
                case '}': case ']':
                $level--;
                $ends_line_level = NULL;
                $new_line_level = $level;
                break;

                case '{': case '[':
                $level++;
                case ',':
                $ends_line_level = $level;
                break;

                case ':':
                $post = " ";
                break;

                case " ": case "\t": case "\n": case "\r":
                $char = "";
                $ends_line_level = $new_line_level;
                $new_line_level = NULL;
                break;
            }
        } else if ( $char === '\\' ) {
            $in_escape = true;
        }
        if( $new_line_level !== NULL ) {
            $result .= "\n".str_repeat( "\t", $new_line_level );
        }
        $result .= $char.$post;
    }

    return $result;
}

function language_manager_menu() {
    add_options_page('Language Manager Options', 'Language Manager', 'manage_options', 'language_manager', 'language_manager_options');
}

function language_manager_options() {
    if (!current_user_can('manage_options'))  {
        wp_die(__('You do not have sufficient permissions to access this page.'));
    }

    echo '<div class="wrap">';
    echo '<h2>Language Manager</h2>';

    if('POST' == $_SERVER['REQUEST_METHOD']) {
        $message = update_languages();
        echo '<div class="update-nag">' . $message . '</div>';
    }

    echo '<form action="" method="POST">';
    echo '<input type="text" value="" />';
    echo '<input type="submit" name="submit" id="submit" class="button button-primary" value="Update Languages">';
    echo '</form>';
    echo '</div>';
}

add_action('admin_menu', 'language_manager_menu');

?>