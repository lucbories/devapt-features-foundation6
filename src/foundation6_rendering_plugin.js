// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import path from 'path'
import Devapt from 'devapt'

const RenderingPlugin = Devapt.RenderingPlugin

// PLUGIN IMPORTS
import button from './rendering_functions/button'
import table from './rendering_functions/table'
import menubar from './rendering_functions/menubar'
import tabs from './rendering_functions/tabs'


const plugin_name = 'Foundation-6' 
const context = plugin_name + '/foundation6_rendering_plugin'



export default class Foundation6Plugin extends RenderingPlugin
{
	constructor(arg_manager)
	{
		super(arg_manager, plugin_name, '1.0.0')
		
		const base_dir = __dirname + '/../node_modules/foundation-sites/dist'
		this.add_public_asset('css', '/' + plugin_name + '/foundation.css', path.join(base_dir, 'foundation.css') )
		this.add_public_asset('css', '/' + plugin_name + '/foundation.min.css', path.join(base_dir, 'foundation.min.css') )
		this.add_public_asset('js', '/' + plugin_name + '/foundation.js', path.join(base_dir, 'foundation.js') )
		this.add_public_asset('js', '/' + plugin_name + '/foundation.min.js', path.join(base_dir, 'foundation.min.js') )
		
		const jquery_dir = base_dir + '/../node_modules/jquery/dist'
		this.add_public_asset('js', '/' + plugin_name + '/jquery.js', path.join(jquery_dir, 'jquery.js') )
		this.add_public_asset('js', '/' + plugin_name + '/jquery.min.js', path.join(jquery_dir, 'jquery.min.js') )
		
		const what_dir = base_dir + '/../node_modules/what-input/'
		this.add_public_asset('js', '/' + plugin_name + '/what-input.js', path.join(what_dir, 'what-input.js') )
		this.add_public_asset('js', '/' + plugin_name + '/what-input.min.js', path.join(what_dir, 'what-input.min.js') )
	}
	
    
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_feature_class:bad class string')
		
		return Foundation6Plugin.get_class(arg_class_name)
	}


	
	/**
	 * Find a rendering function.
	 * 
	 * @param {string} arg_type - rendering item type.
	 * 
	 * @returns {Function} - rendering function.
	 */
	static find_rendering_function(arg_type)
	{
		// console.log(context + ':find_rendering_function:type=' + arg_type)

		if ( ! T.isString(arg_type) )
		{
			console.warn(context + ':find_rendering_function:bad type=' + arg_type, T.isString(arg_type), typeof arg_type, arg_type)
			return undefined
		}
		
		
		switch(arg_type.toLocaleLowerCase())
		{
			// RENDERING FUNCTIONS
			case 'button':
				// console.log(button, context + ':find_rendering_function:found type=' + arg_type)
				return button
			
			case 'table':
				// console.log(table, context + ':find_rendering_function:found type=' + arg_type)
				return table
			
			case 'menubar':
				// console.log(menubar, context + ':find_rendering_function:found type=' + arg_type)
				return menubar
			
			case 'tabs':
				// console.log(tabs, context + ':find_rendering_function:found type=' + arg_type)
				return tabs
		}

		// console.log(tabs, context + ':find_rendering_function:not found type=' + arg_type.toLocaleLowerCase())
		return undefined
	}
}
