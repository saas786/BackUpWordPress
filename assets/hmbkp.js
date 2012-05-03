jQuery( document ).ready( function( $ ) {

	// Setup the tabs
	$( '.hmbkp-tabs' ).tabs();

	// Set the first tab to be active
	if ( ! $( '.subsubsub a.current' ).size() )
		$( '.subsubsub li:first a').addClass( 'current' );

	// Replace fancybox href with ajax url
	$( '.fancybox' ).each( function() {
		$( this ).attr( 'href', $( this ).attr( 'href' ).replace( userSettings['url'] + 'wp-admin/tools.php', ajaxurl.replace( location.origin, '' ) ) );
	} );

	// Initialize fancybox
	$( '.fancybox' ).fancybox( {

		'modal'		: true,
		'type'		: 'ajax',
		'maxWidth'	: 320,
		'afterShow'	: function() {

			$( '.hmbkp-tabs' ).tabs();

			if ( $( '.hmbkp-form p.submit:contains(\'Update\')' ).size() )
				$( '<button type="button" class="button-secondary hmbkp_cancel">' + objectL10n.cancel + '</button></p>' ).appendTo( '.hmbkp-form p.submit' );

			$( '.hmbkp_cancel' ).click( function() {
				$.fancybox.close();
			} );

		}

	} );

	// Show delete confirm message for delete schedule
	$( document ).on( 'click', '.hmbkp-schedule-actions .delete-action', function( e ) {

		if ( ! confirm( objectL10n.delete_schedule ) )
			e.preventDefault();

	} );

	// Show delete confirm message for delete backup
	$( document ).on( 'click', '.hmbkp_manage_backups_row .delete-action', function( e ) {

		if ( ! confirm( objectL10n.delete_backup ) )
			e.preventDefault();

	} );

	// Show delete confirm message for remove exlude rule
	$( document ).on( 'click', '.hmbkp-edit-schedule-excludes-form .delete-action', function( e ) {

		if ( ! confirm( objectL10n.remove_exclude_rule ) )
			e.preventDefault();

	} );

	// Preview exclude rule
	$( document ).on( 'click', '.hmbkp_preview_exclude_rule', function() {

		if ( ! $( '.hmbkp_add_exclude_rule input' ).val() ) {
			$( '.hmbkp_add_exclude_rule ul' ).remove();
			$( '.hmbkp_add_exclude_rule p' ).remove();
			return;
		}

		$.post(
			ajaxurl,
			{ 'action'	: 'hmbkp_file_list', 'hmbkp_schedule_excludes' : $( '.hmbkp_add_exclude_rule input' ).val(), 'hmbkp_schedule_id' : $( '[name="hmbkp_schedule_id"]' ).val(), 'hmbkp_file_method' : 'get_excluded_files' },
			function( data ) {

				$( '.hmbkp_add_exclude_rule ul' ).remove();
				$( '.hmbkp_add_exclude_rule p' ).remove();

				$( '.hmbkp_add_exclude_rule' ).append( data );

				$( '.hmbkp-edit-schedule-excludes-form' ).addClass( 'hmbkp-exclude-preview-open' );

			}
		);

	} );

	// Fire the preview button when the enter key is pressed in the preview input
	$( document ).on( 'keypress', '.hmbkp_add_exclude_rule input', function( e ) {

		if ( ! $( '.hmbkp_add_exclude_rule input' ).val() )
			return true;

		var code = ( e.keyCode ? e.keyCode : e.which );

		if ( code != 13 )
			return true;

		$( '.hmbkp_preview_exclude_rule' ).click();

		e.preventDefault();

	} );

	// Cancel add exclude rule
	$( document ).on( 'click', '.hmbkp_cancel_save_exclude_rule, .hmbkp-edit-schedule-excludes-form .submit button', function() {

	    $( '.hmbkp_add_exclude_rule ul' ).remove();
	    $( '.hmbkp_add_exclude_rule p' ).remove();

	    $( '.hmbkp-edit-schedule-excludes-form' ).removeClass( 'hmbkp-exclude-preview-open' );

	} );

	// Toggle additional fieldsets on
	$( document ).on( 'click', '.hmbkp-toggle-fieldset', function() {

		// Get the current fieldset
		var fromFieldset = 'fieldset.' + $( this ).closest( 'fieldset' ).attr( 'class' );
		var toFieldset = 'fieldset.' + $( this ).attr( 'data-hmbkp-fieldset' );

		// Show the one we are moving too
		$( toFieldset ).show().find( 'p.submit button' ).data( 'hmbkp-previous-fieldset', fromFieldset );

		// Animate
		$( fromFieldset ).animate( {
			marginLeft : '-100%'
		}, 'fast', function() {
			$( this ).hide();
		} );

	} );

	// Toggle additional fieldsets off
	$( document ).on( 'click', '.hmbkp-form fieldset + fieldset p.submit button', function() {

		// Get the current fieldset
		var fromFieldset = 'fieldset.' + $( this ).closest( 'fieldset' ).attr( 'class' );
		var toFieldset = $( this ).data( 'hmbkp-previous-fieldset' );

		// Show the one we are moving too
		$( toFieldset ).show();

		$( toFieldset ).animate( {
				marginLeft : '0'
			}, 'fast', function() {
				$( fromFieldset ).hide();
			}
		);

	} );

	// Add exclude rule
	$( document ).on( 'click', '.hmbkp_save_exclude_rule', function() {

		$.post(
			ajaxurl,
			{ 'action' : 'hmbkp_add_exclude_rule', 'hmbkp_exclude_rule' : $( '.hmbkp_add_exclude_rule input' ).val(), 'hmbkp_schedule_id' : $( '[name="hmbkp_schedule_id"]' ).val() },
			function( data ) {
				$( '.hmbkp-edit-schedule-excludes-form' ).replaceWith( data );
				$( '.hmbkp-edit-schedule-excludes-form' ).show();
				$( '.hmbkp-tabs' ).tabs();
			}
		);

	} );

	// Remove exclude rule
	$( document ).on( 'click', '.hmbkp-edit-schedule-excludes-form td a', function( e ) {

		e.preventDefault();

		$.post(
			ajaxurl,
			{ 'action' : 'hmbkp_delete_exclude_rule', 'hmbkp_exclude_rule' : $( this ).closest( 'td' ).attr( 'data-hmbkp-exclude-rule' ), 'hmbkp_schedule_id' : $( '[name="hmbkp_schedule_id"]' ).val() },
			function( data ) {
				var backButton = $( '.hmbkp-edit-schedule-excludes-form p.submit' ).clone( true );
				$( '.hmbkp-edit-schedule-excludes-form' ).replaceWith( data );
				$( '.hmbkp-edit-schedule-excludes-form' ).show().append( backButton );
				$( '.hmbkp-tabs' ).tabs();
			}
		);

	} );

	// Edit schedule form submit
	$( document ).on( 'submit', 'form.hmbkp-form', function( e ) {

		$( '.hmbkp-error span' ).remove();
		$( '.hmbkp-error' ).removeClass( 'hmbkp-error' );

		e.preventDefault();

		$.post(
			ajaxurl + '?' + $( this ).serialize(),
			{ 'action'	: 'hmnkp_edit_schedule_submit' },
			function( data ) {

				// Assume success if no data passed back
				if ( ! data ) {

					$.fancybox.close();

					// Reload the page so we see changes
					location.reload( true );

				} else {

					// Get the errors json string
					errors = JSON.parse( data );

					// Loop through the errors
					$.each( errors, function( key, value ) {

						// Focus the first field that errored
						if ( typeof( hmbkp_focused ) == 'undefined' ) {

							$( '[name="' + key + '"]' ).focus();

							hmbkp_focused = true;

						}

						// Add an error class to all fields with errors
						$( '[name="' + key + '"]' ).closest( 'label' ).addClass( 'hmbkp-error' );

						// Add the error message
						$( '[name="' + key + '"]' ).after( '<span>' + value + '</span>' );

					} );

				}

			}
		);

	} );

	// Text the cron response using ajax
	$.get( ajaxurl, { 'action' : 'hmbkp_cron_test' },
	    function( data ) {
	    	if ( data != 1 ) {
		    	$( '.wrap > h2' ).after( data );
		    }
	    }
	);

	// Calculate the estimated backup size // TODO
	if ( $( '.hmbkp_estimated-size .calculate' ).size() ) {
		$.get( ajaxurl, { 'action' : 'hmbkp_calculate' },
		    function( data ) {
		    	$( '.hmbkp_estimated-size .calculate' ).fadeOut( function() {
		    		$( this ).empty().append( data );
		    	} ).fadeIn();
		    }
		);
	}

	if ( $( '.hmbkp-running' ).size() ) {
		hmbkpRedirectOnBackupComplete();
	}

	$( '.hmbkp-run' ).live( 'click', function( e ) {

		$.ajaxSetup( { 'cache' : false } );

		ajaxRequest = $.get(
			ajaxurl,
			{ 'action' : 'hmbkp_run_schedule', 'hmbkp_schedule_id' : $( '[data-hmbkp-schedule-id]' ).attr( 'data-hmbkp-schedule-id' ) },
			function( data ) {
				$( '.hmbkp-schedule-actions' ).replaceWith( data );
			}
		);

		$( this ).closest( '.hmbkp-schedule-sentence' ).addClass( 'hmbkp-running' );

	  	setTimeout( function() {

			ajaxRequest.abort();

	  		hmbkpRedirectOnBackupComplete();

	  	}, 500 );

		e.preventDefault();

	} );

} );

function hmbkpRedirectOnBackupComplete( schedule_id ) {

	jQuery.get(
		ajaxurl,
		{ 'action' : 'hmbkp_is_in_progress', 'hmbkp_schedule_id' : jQuery( '[data-hmbkp-schedule-id]' ).attr( 'data-hmbkp-schedule-id' ) },
		function( data ) {

			if ( data == 0 ) {

				location.reload( true );

			} else {

				setTimeout( 'hmbkpRedirectOnBackupComplete();', 1000 );

				jQuery( '.hmbkp-schedule-actions' ).replaceWith( data );

			}
		}
	);

}