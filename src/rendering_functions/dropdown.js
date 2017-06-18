// NPM IMPORTS
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'


const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const plugin_name = 'Foundation6' 
const context = plugin_name + '/rendering_function/dropdown'



// DEFAULT STATE
const default_state = {
	label:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	type: 'dropdown',
	class:undefined,
	style:undefined,
	has_mode_hover:false,
	has_mode_toggle:true,
	button:{
		has_hollow:false,
		has_dropdown:true
	},
	pane:{
		class:undefined,
		style:'overflow:scroll;height:60%;width:40%;'
	},
	view:undefined
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
	const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined
	const cell_fn = (cell/*, index*/) => {
		const content = T.isFunction(rendering_factory) ? rendering_factory(cell, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : cell.toString()
		const tag_props = {}
		return h('div', tag_props, [content])
	}

	// GET SETTINGS ATTRIBUTES
	const has_mode_hover  = T.isBoolean(settings.has_mode_hover)  ? settings.has_mode_hover  : false
	const has_mode_toggle = T.isBoolean(settings.has_mode_toggle) ? settings.has_mode_toggle : true


	// BUILD BUTTON TAG
	const button_settings = settings.button ? settings.button : {}
	const button_props = {}
	button_props.id = settings.id + '_button'
	button_props.type = 'button'
	button_props.className = button_settings.class ? button_settings.class + ' button' : 'button'
	button_props.attributes = { 'data-toggle' : settings.id + '_div' }
	if (button_settings.has_dropdown)
	{
		button_props.className += ' dropdown'
	}
	if (button_settings.has_hollow)
	{
		button_props.className += ' hollow'
	}
	const button_tag = h('button', button_props, state.label)
	// button(button_settings, button_state, rendering_context, rendering_result)
	// const button_tag = rendering_result.get_vtree(button_settings.id)
	// delete rendering_result.vtrees[button_settings.id]


	// BUILD DIV TAG
	const div_id       = settings.id + '_div'
	const pane_settings = settings.pane ? settings.pane : {}
	pane_settings.class = pane_settings.class ? pane_settings.class : ''
	if ( pane_settings.class.indexOf('dropdown-pane') == -1)
	{
		pane_settings.class += ' dropdown-pane'
	}
	const div_children = [ cell_fn(settings.view) ]
	const div_props = { id:div_id, style:pane_settings.style, className:pane_settings.class }
	div_props.attributes = { 'data-dropdown': '' }
	if (has_mode_toggle)
	{
		div_props.attributes['data-auto-focus'] = 'true'
	}
	else if (has_mode_hover)
	{
		div_props.attributes['data-hover'] = 'true'
		div_props.attributes['data-hover-pane'] = 'true'
	}
	const div_tag = h('div', div_props, div_children )


	// COMPONENT TAG
	const tag_id = settings.id
	const tag_children = [button_tag, div_tag]
	settings.class = settings.class ? settings.class + ' devapt-dropdown' : 'devapt-dropdown'
	const tag_props = { id:tag_id, style:settings.style, className:settings.class }
	const tag = h('div', tag_props, tag_children )
	
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
				// var jqo = $("#${tag_id}");
				var jqo = $(".devapt-dropdown");
				if ( ! $('div[data-dropdown]', jqo).data('zfPlugin') )
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
				id:'js-foundation-dropdown-init',
				content:js_init
			}
		]
	)

	return rendering_result
}
