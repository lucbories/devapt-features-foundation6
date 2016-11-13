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
const context = plugin_name + '/foundation6_rendering_plugin/tabs'



// DEFAULT STATE
const default_state = {
	label:undefined,
	items:undefined,
	has_vertical:false
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
	const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined

	// GET STATE ATTRIBUTES
	const label_value = T.isString(state.label)  ? state.label : undefined
	const items_value = T.isArray(state.items)   ? state.items : []
	const titles_value = items_value.map( (item)=>item.title )
	const contents_value = items_value.map( (item)=>item.content )
	if (state.has_vertical)
	{
		// return `\n<div ${html_id}>\n<div class="row collapse">\n<div class="medium-2 columns">\n${html_titles}\n</div>\n<div class="medium-10 columns">\n${html_contents}\n</div>\n</div>\n</div>\n`
	}
	
	// DEBUG
	rendering_context.trace_fn(items_value, 'items_value')
	

	// BUILD TABS TITLES
	const items_tab_is_active = (index)=>(index == 0) ? ' is-active' : ''
	const items_tab_is_aria_selected = (index)=>(index == 0) ? true : false // TODO
	const titles_create   = (title, index)=>{
		const r = rendering_factory(title, rendering_context, settings.children).get_final_vtree(undefined, rendering_result)
		return r ? r : 'Tab ' + index
	}
	const titles_a = (title, index)=>h('a', { href:'#' + settings.id + '_content_' + index, 'aria-selected':items_tab_is_aria_selected(index) ? 'true' : 'false' }, titles_create(title, index) )
	const titles_li =  (title, index)=>h('li', { class:'tabs-title' + items_tab_is_active(index) }, titles_a(title, index))
	const titles_id = settings.id + '_titles'
	const titles_children = titles_value.map(titles_li)
	const titles_props = { id:titles_id, style:undefined, class:'tabs' + (state.has_vertical ? ' vertical' : ''), 'data-tabs':'' }
	const titles = h('ul', titles_props, titles_children)


	// BUILD TABS CONTENTS
	const contents_item = (content)=>rendering_factory(content, rendering_context, settings.children)
	const contents_div = (content, index)=>h('div', { id:settings.id + '_content_' + index, class:'tabs-panel' + items_tab_is_active(index) }, contents_item(content) )
	const contents_children = contents_value.map(contents_div)
	const contents_props = { style:undefined, class:'tabs-content' + (state.has_vertical ? ' vertical' : ''), 'data-tabs-content':titles_id }
	const contents = h('div', contents_props, contents_children)


	// BUILD DIV TAG
	const tag_id = settings.id
	const tag_children = [titles, contents]
	const tag_props = { id:tag_id, style:settings.style, class:settings.class }
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

	const js_init = '$(document).ready( function(){ var tabs = $("#' + tag_id + '"); tabs.show() } )'
	rendering_result.add_body_scripts_tags(
		[
			{
				id:'js-foundation-tabs-init',
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
