
import T from 'typr'
// import assert from 'assert'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.DefaultRenderingPlugin
const DefaultTable = RenderingPlugin.get_class('Table')


export default class Table extends DefaultTable
{
	constructor(arg_name, arg_settings)
	{
		// UPDATE SETTINGS
		arg_settings = Table.normalize_settings(arg_settings)
		arg_settings.scripts_urls = arg_settings.scripts_urls.concat(
			[
				'plugins/Foundation-6/jquery.min.js',
				'plugins/Foundation-6/foundation.js'
			]
		)
		arg_settings.styles_urls = arg_settings.styles_urls.concat(
			['plugins/Foundation-6/foundation.min.css']
		)
		arg_settings.css.classes_by_tag['table'] += ' f6_table'
		
		if ( T.isObject(arg_settings.state) )
		{
			// ADD SCROLL CSS
			if (arg_settings.state.has_scroll)
			{
				arg_settings.css.classes_by_tag['table'] += ' scroll'
			}
			
			// ADD STACK CSS FOR SMALL SCREENS
			if (arg_settings.state.has_stack)
			{
				arg_settings.css.classes_by_tag['table'] += ' stack'
			}
			
			// ADD HOVER CSS
			if (arg_settings.state.has_hover)
			{
				arg_settings.css.classes_by_tag['table'] += ' hover'
			}
		}
		
		super(arg_name, arg_settings)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
			has_scroll: false,
			has_stack: false,
			has_hover: false
		}
	}
}
