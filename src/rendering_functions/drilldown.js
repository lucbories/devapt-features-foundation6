// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'
import Devapt from 'devapt'

// PLUGIN IMPORTS
// import button from './button'

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
// const button = DefaultRenderingPlugin.find_rendering_function('button')
// const anchor = DefaultRenderingPlugin.find_rendering_function('anchor')


const plugin_name = 'Foundation6' 
const context = plugin_name + '/rendering_function/drilldown'



// DEFAULT STATE
const default_state = {
	label:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	type: 'drilldown',
	class:undefined,
	style:undefined,
	has_auto_height:false,
	has_animate_height:false
}



/**
 * Button rendering with given state, produce a rendering result.
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
	// const cell_fn = (cell/*, index*/) => {
	// 	const content = T.isFunction(rendering_factory) ? rendering_factory(cell, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : cell.toString()
	// 	const tag_props = {}
	// 	return h('div', tag_props, [content])
	// }

	// GET SETTINGS ATTRIBUTES
	const has_auto_height    = T.isBoolean(settings.has_auto_height)  ? settings.has_auto_height  : false
	const has_animate_height = T.isBoolean(settings.has_animate_height)  ? settings.has_animate_height  : false

	// GET STATE ATTRIBUTES
	const items_array = T.isArray(state.items) ? state.items : []
	// console.log(context + ':items_array:', items_array)
	
	// BUILD MENU LIST
	let counter = 0
	const menu_list_fn = (items)=>{
		if ( ! T.isArray(items) )
		{
			return []
		}

		const li_array = []
		items.forEach(
			(item)=>{
				if ( T.isArray(item) )
				{
					// console.log(context + ':menu_list_fn:array item:', item)

					const item_id = settings.id + '_menu_' + counter
					const a_tag = h('a', { attributes:{href:'#ignore:' + item_id} }, 'item')
					const li_tag = h('li', { attributes:{ role:'menuitem' }, className:'devapt-drilldown-item' }, [a_tag, menu_fn(item)])
					li_array.push(li_tag)
					++counter
					return
				}

				if ( T.isString(item) || T.isNumber(item) || T.isBoolean(item) )
				{
					// console.log(context + ':menu_list_fn:string|number|boolean item:', item)

					const item_id = settings.id + '_menu_' + counter
					const a_tag = h('a', { attributes:{href:'#ignore:' + item_id} }, '' + item)
					const li_tag = h('li', { attributes:{ role:'menuitem' }, className:'devapt-drilldown-item' }, [a_tag])
					li_array.push(li_tag)
					++counter
					return
				}

				// console.log(context + ':menu_list_fn:other item:', item)

				const item_id = settings.id + '_menu_' + counter
				const a_tag = h('a', { attributes:{href:'#ignore:' + item_id} }, 'bad item type (not array/string/number/boolean)')
				const li_tag = h('li', { attributes:{ role:'menuitem' }, className:'devapt-drilldown-item' }, [a_tag])
				li_array.push(li_tag)
				++counter
			}
		)

		return li_array
	}
	const menu_fn = (items)=>{
		return h('ul', {className:'vertical menu'}, menu_list_fn(items))
	}


	// BUILD TOP UL TAG
	const top_ul_settings = settings.ul ? settings.ul : {}
	const top_ul_id       = settings.id + '_top_ul'
	top_ul_settings.class = top_ul_settings.class ? top_ul_settings.class : ''
	if ( top_ul_settings.class.indexOf('vertical menu') == -1)
	{
		top_ul_settings.class += ' vertical menu'
	}
	if (items_array.length == 0)
	{
		items_array.push('empty')
	}
	const top_ul_children = menu_list_fn(items_array)
	// console.log(context + ':top_ul_children:', top_ul_children)

	const top_ul_props = { id:top_ul_id, style:settings.style, className:top_ul_settings.class + ' devapt-drilldown' }
	top_ul_props.attributes = { 'data-drilldown': '' }
	if (has_auto_height)
	{
		top_ul_props.attributes['data-auto-height'] = 'true'
	}
	if (has_animate_height)
	{
		top_ul_props.attributes['data-animate-height'] = 'true'
	}
	const top_ul_tag = h('ul', top_ul_props, top_ul_children )


	// COMPONENT TAG
	const tag_id = settings.id
	const tag_children = [top_ul_tag]
	const tag_props = { id:tag_id, style:settings.style, className:settings.class }
	const tag = h('div', tag_props, tag_children )
	// console.log(context + ':tag:', tag)

	
	rendering_result.add_vtree(tag_id, tag)


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

	const js_init = `
		window.devapt().on_content_rendered(
			function(){
				var jqo = $("#${tag_id}");
				if ( ! $('.menu[data-drilldown]', jqo).data('zfPlugin') )
				{
					jqo.foundation()
				}
			},
			undefined,
			true
		)`

	rendering_result.add_body_scripts_tags(
		[
			{
				id:'js-foundation-drilldown-init',
				content:js_init
			}
		]
	)

	return rendering_result
}
