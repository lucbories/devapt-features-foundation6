
// NPM IMPORTS
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'


const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const plugin_name = 'Foundation6' 
const context = plugin_name + '/rendering_function/block_grid_dock'



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
	const tag_dock_id = settings.id

	// GET STATE ATTRIBUTES
	const items_value   = T.isArray(state.items) ? state.items : []

	// BUILD DOCK ITEM CONTENT
	const item_content_fn = (item)=>{
		const cell_id = T.isObject(item) && T.isString(item.view) ? item.view : ( (item && item.settings && item.settings.id) ? item.settings.id : undefined)
		if (! cell_id)
		{
			console.error(context + ':item_content_fn:bad dock item id for ', cell)
			return undefined
		}
		const item_vnode = T.isFunction(rendering_factory) ? rendering_factory(cell_id, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : item.toString()
		return item_vnode
	}
	
	// BUILD DOCK SPACE
	settings.class = T.isString(settings.class) ? settings.class + ' ' : ''
	settings.class += 'devapt-dock' 
	const tag_dock_children = items_value.map(item_content_fn)
	const tag_dock_style = (settings.style ? settings.style: '') + ';border:1px solid #e5e5e5;'
	
	const tag_dock_props = { id:tag_dock_id, style:tag_dock_style, className:settings.class + ' ' + sizes_class }
	const tag_dock = h('div', tag_dock_props, tag_dock_children )

	rendering_result.add_vtree(tag_dock_id, tag_dock)

	return rendering_result
}
