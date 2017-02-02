// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'
import Devapt from 'devapt'

// DEVAPT IMPORTS
const has_window = new Function('try {return this===window;}catch(e){ return false;}')
let DefaultRenderingPlugin = undefined
if (has_window())
{
	// COMMON IMPORTS
	const plugin = require('../../node_modules/devapt/dist/common/default_plugins/rendering_default_plugin.js')
	// console.log('Devapt', plugin)
	DefaultRenderingPlugin = plugin.default
} else {
	DefaultRenderingPlugin = Devapt.DefaultRenderingPlugin
}
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')


const plugin_name = 'Foundation6' 
const context = plugin_name + '/rendering_function/block_grid'



// DEFAULT STATE
const default_state = {
	label:undefined,
	items:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined,
	small_size_count:1,
	medium_size_count:2,
	large_size_count:3
}



/**
 * HBox rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined

	// GET SETTINGS ATTRIBUTES
	settings.class = settings.class ? settings.class : ''
	const small_size_count  = T.isNumber(settings.small_size_count) ? settings.small_size_count : default_settings.small_size_count
	const medium_size_count = T.isNumber(settings.medium_size_count) ? settings.medium_size_count : default_settings.medium_size_count
	const large_size_count  = T.isNumber(settings.large_size_count) ? settings.large_size_count : default_settings.large_size_count
	const sizes_class = 'row small-up-' + small_size_count + ' medium-up-' + medium_size_count + ' large-up-' + large_size_count

	// GET STATE ATTRIBUTES
	const items_value   = T.isArray(state.items)   ? state.items : undefined

	// BUILD CELL
	const cell_fn = (cell) => {
		const content = T.isFunction(rendering_factory) ? rendering_factory(cell, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : cell.toString()
		const tag_props = { className:'column column-block' }
		return h('div', tag_props, [content])
	}

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = items_value ? items_value.map(cell_fn) : undefined
	const tag_props = { id:tag_id, style:settings.style, className:settings.class + sizes_class }
	const tag = h('div', tag_props, tag_children )
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}
