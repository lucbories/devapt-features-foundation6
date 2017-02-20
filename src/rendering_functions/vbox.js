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
const context = plugin_name + '/rendering_function/vbox'



// DEFAULT STATE
const default_state = {
	label:undefined,
	items:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * VBox rendering with given state, produce a rendering result.
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
	// if ( settings.class.indexOf('row') == -1)
	// {
	// 	settings.class += ' row'
	// }

	// GET STATE ATTRIBUTES
	const items_value   = T.isArray(state.items)   ? state.items : undefined

	// BUILD CELL
	const cell_fn = (cell/*, index*/) => {
		const content = T.isFunction(rendering_factory) ? rendering_factory(cell, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : cell.toString()
		const div = h('div', { className:'small-12 column' }, [content])
		const tag_props = { className:'row' }
		return h('div', tag_props, [div])
	}

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = items_value ? items_value.map(cell_fn) : undefined
	const tag_props = { id:tag_id, style:settings.style, className:settings.class }
	const tag = h('div', tag_props, tag_children )
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}
