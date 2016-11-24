// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'
import Devapt from 'devapt'

// COMMON IMPORTS
const DefaultRenderingPlugin = Devapt.DefaultRenderingPlugin
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const RenderingResult = DefaultRenderingPlugin.find_rendering_function('RenderingResult')
const anchor = DefaultRenderingPlugin.find_rendering_function('anchor')


const plugin_name = 'Foundation-6' 
const context = plugin_name + '/foundation6_rendering_plugin/menubar'



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
 * Foundation 6 Menubar rendering with given state, produce a rendering result.
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
	// const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined
		
	// GET STATE ATTRIBUTES
	const label_value = T.isString(state.label)  ? state.label : undefined
	const items_value = T.isArray(state.items)   ? state.items : []
	const left_items  = items_value.filter( (item)=>item ? ( T.isString(item.position) && item.position == 'right' ? false : true  ) : false )
	const right_items = items_value.filter( (item)=>item ? ( T.isString(item.position) && item.position == 'right' ? true  : false ) : false )
	
	// DEBUG
	rendering_context.trace_fn(items_value, 'items_value')
	rendering_context.trace_fn(left_items, 'left_items')
	rendering_context.trace_fn(right_items, 'right_items')
	

	// BUILD MENU TAG
	const extract_vnode = (result)=>result.get_final_vtree(undefined, rendering_result)
	const anchor_settings = { children:settings.children }
	const menu_anchor   = (item)=>anchor(anchor_settings, item, rendering_context, undefined)
	const menu_a        = (label)=>h('a', {href:'#'}, label)
	const menu_cmd      = (item)=>h('li', { attributes:{ role:'menuitem' } }, [ extract_vnode( menu_anchor(item) ) ] )
	const menu_no_cmd   = (item)=>h('li', { attributes:{ role:'menuitem' } }, [ menu_a( T.isString(item) ? item : item.label ) ] )
	const submenu       = (item)=>{
		const a = menu_a(item.label)
		const m = menus(item.items)
		const ul = h('ul', { className:'dropdown menu', attributes:{ 'data-dropdown-menu':'' } }, m ? [m] : [])
		const li = h('li', { attributes:{ role:'menuitem' } }, [a, ul])
		return li
	}
	const menu = (item)=>T.isObject(item) && T.isArray(item.items) && item.items.length > 0 ? submenu(item) : (item.command ?  menu_cmd(item) : menu_no_cmd(item) )
	const menus = (items)=>items.map(menu)
	const menu_item = (item)=>T.isArray(item) ? menus(item) : (T.isObject(item) ? menu(item) : (T.isString(item) ? menu_no_cmd(item) : undefined))
	
	// BUILD LEFT MENUS TAG
	const left_ul_children = left_items.map(menu_item) //DEBUG .forEach( (value, index)=>console.log('left value at %n:%s', index, value) )
	const left_ul = h('ul', { className:'dropdown menu', attributes:{ 'data-dropdown-menu':'' } }, left_ul_children ? [left_ul_children] : [])
	const left = h('div', { className:'top-bar-left' }, [left_ul])

	// BUILD RIGHT MENUS TAG
	const right_ul_children = right_items.map(menu_item)
	const right_ul = h('ul', { className:'dropdown menu', attributes:{ 'data-dropdown-menu':''} }, right_ul_children ? [right_ul_children] : [])
	const right = h('div', { className:'top-bar-right' }, [right_ul])

	// BUILD TITLE TAG
	const label = h('strong', undefined, [label_value])
	const title_ul_li = h('li', { attributes:{ role:'menuitem' } }, [label])
	const title_ul = h('ul', { className:'dropdown menu' }, [title_ul_li])
	const title = h('div', { className:'top-bar-title' }, [title_ul])

	// BUILD NAV TAG
	// const top = h('div', { className:'top-bar'}, [title, left, right])
	const nav_children = [title, left, right]
	const nav_props = { style:settings.style, className:'top-bar' }
	const nav = h('nav', nav_props, nav_children)

	// BUILD DIV TAG
	const tag_id = settings.id
	const tag_children = [nav]
	const tag_props = { id:tag_id, style:settings.style, className:settings.class }
	const tag = h('div', tag_props, tag_children)
	

	// UPDATE RENDERING RESULT
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

	const js_init = `
		window.devapt().on_content_rendered(
			function(){
				var menubar = $("#${tag_id}");
				if ( ! $('.dropdown .menu', menubar).data('zfPlugin') )
				{
					menubar.foundation()
				}
			},
			undefined,
			true
		)`

	rendering_result.add_body_scripts_tags(
		[
			{
				id:'js-foundation-menubar-init',
				content:js_init
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
