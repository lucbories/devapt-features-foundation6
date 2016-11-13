// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
import Devapt from 'devapt'

// COMMON IMPORTS
const DefaultRenderingPlugin = Devapt.DefaultRenderingPlugin
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const table = DefaultRenderingPlugin.find_rendering_function('table')


const plugin_name = 'Foundation-6' 
const context = plugin_name + '/foundation6_rendering_plugin/table'



// DEFAULT STATE
const default_state = {
	label:undefined,
	columns:undefined,  // array (rows) of array (th values)
	items:undefined,    // array (rows) of array (cells)
	footers:undefined   // array (rows) of array (th values)
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined,
	has_scroll:undefined,
	has_stack:undefined,
	has_hover:undefined
}



/**
 * Table rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings={}, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	// const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined
	
	// GET SETTINGS ATTRIBUTES
	const has_scroll_value = T.isBoolean(settings.has_scroll) ? settings.has_scroll : undefined
	const has_stack_value  = T.isBoolean(settings.has_stack)  ? settings.has_stack  : undefined
	const has_hover_value  = T.isBoolean(settings.has_hover)  ? settings.has_hover  : undefined
	if (has_scroll_value)
	{
		settings.class = settings.class ? settings.class + ' scroll' : 'scroll'
	}
	if (has_stack_value)
	{
		settings.class = settings.class ? settings.class + ' stack' : 'stack'
	}
	if (has_hover_value)
	{
		settings.class = settings.class ? settings.class + ' hover' : 'hover'
	}

	// BUILD TAG
	table(settings, state, rendering_context, rendering_result)

	rendering_result.add_body_scripts_urls(
		[
			{
				id:'js-jquery',
				src:'plugins/' + plugin_name + '/jquery.min.js'
			},
			{
				id:'js-foundation',
				src:'plugins/' + plugin_name + '/foundation.js'
			}
		]
	)

	rendering_result.add_head_styles_urls(
		[
			{
				id:'css-foundation',
				href:'plugins/' + plugin_name + '/foundation.min.css'
			}
		]
	)

	return rendering_result
}
