
import T from 'typr'
// import assert from 'assert'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.DefaultRenderingPlugin
const DefaultButton = RenderingPlugin.get_class('Button')


// const context = 'plugins/backend-foundation6/plugin/button'


export default class Button extends DefaultButton
{
	constructor(arg_name, arg_settings)
	{
		// UPDATE SETTINGS
		arg_settings = Button.normalize_settings(arg_settings)
		arg_settings.scripts_urls = arg_settings.scripts_urls.concat(
			[
				'plugins/Foundation-6/jquery.min.js',
				'plugins/Foundation-6/foundation.js'
			]
		)
		arg_settings.styles_urls = arg_settings.styles_urls.concat(
			['plugins/Foundation-6/foundation.min.css']
		)
		arg_settings.css.classes_by_tag['button'] += ' f6_button'
		
		if ( T.isObject(arg_settings.state) )
		{
			// BUTTON SIZE
			if ( T.isString(arg_settings.state.size) )
			{
				if ( ['tiny', 'small', 'large', 'expanded', 'expanded tiny', 'expanded small', 'expanded large'].indexOf(arg_settings.state.size) >= 0 )
				{
					arg_settings.css.classes_by_tag['button'] += ' ' + arg_settings.state.size
				}
			}
			
			// BUTTON HOLLOW
			if ( T.isBoolean(arg_settings.state.has_hollow) && arg_settings.state.has_hollow )
			{
				arg_settings.css.classes_by_tag['button'] += ' hollow'
			}
			
			// BUTTON DROPDOWN
			if ( T.isBoolean(arg_settings.state.has_dropdown) && arg_settings.state.has_dropdown )
			{
				arg_settings.css.classes_by_tag['button'] += ' dropdown'
			}
			
			// BUTTON MEANING (COLOR)
			if ( T.isString(arg_settings.state.meaning) )
			{
				if ( ['secondary', 'success', 'alert', 'warning', 'disabled'].indexOf(arg_settings.state.size) >= 0 )
				{
					arg_settings.css.classes_by_tag['button'] += ' ' + arg_settings.state.meaning
				}
			}
		}
		arg_settings.css.classes_by_tag['button'] += ' button'
		
		super(arg_name, arg_settings)
	}
}
