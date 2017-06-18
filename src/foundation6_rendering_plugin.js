
// NPM IMPORTS
import assert from 'assert'
import path from 'path'

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'
import RenderingPlugin from 'devapt-core-common/dist/js/plugins/rendering_plugin'

// PLUGIN IMPORTS
import hbox_fn from './rendering_functions/hbox'
import vbox_fn from './rendering_functions/vbox'
import button_fn from './rendering_functions/button'
import table_fn from './rendering_functions/table'
import menubar_fn from './rendering_functions/menubar'
import tabs_fn from './rendering_functions/tabs'
import dropdown_fn from './rendering_functions/dropdown'
import drilldown_fn from './rendering_functions/drilldown'
import block_grid_fn from './rendering_functions/block_grid'
import block_grid_dock_fn from './rendering_functions/block_grid_dock'


const plugin_name = 'Foundation6' 
const context = plugin_name + '/foundation6_rendering_plugin'



export default class Foundation6Plugin extends RenderingPlugin
{
	constructor(arg_runtime, arg_manager)
	{
		super(arg_runtime, arg_manager, plugin_name, '1.0.0')
		
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

		const dist_dir = __dirname + '/../dist/'
		this.add_public_asset('js', '/' + plugin_name + '/devapt-features-foundation6.js', path.join(dist_dir, 'devapt-features-foundation6.js') )
	}



	/**
	 * Get plugin js asset files for browser loading.
	 * 
	 * @returns {string}
	 */
	get_browser_plugin_file_url()
	{
		return plugin_name + '/devapt-features-foundation6.js'
	}
	
	
    
	/**
     * Get a feature class.
	 * 
     * @param {string} arg_class_name - feature class name.
     * 
	 * @returns {object|undefined} feature class.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_feature_class:bad class string')
		
		return undefined
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
			case 'hbox':				return hbox_fn
			case 'vbox':				return vbox_fn
			case 'button':				return button_fn
			case 'table':				return table_fn
			case 'menubar':				return menubar_fn
			case 'tabs':				return tabs_fn
			case 'dropdown':			return dropdown_fn
			case 'drilldown':			return drilldown_fn
			case 'block_grid':			return block_grid_fn
			case 'block_grid_dock':		return block_grid_dock_fn
		}

		// console.log(tabs, context + ':find_rendering_function:not found type=' + arg_type.toLocaleLowerCase())
		return undefined
	}
}
