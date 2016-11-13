// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'
import Devapt from 'devapt'

// COMMON IMPORTS
const DefaultRenderingPlugin = Devapt.DefaultRenderingPlugin
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const button = DefaultRenderingPlugin.find_rendering_function('button')


const plugin_name = 'Foundation-6' 
const context = plugin_name + '/foundation6_rendering_plugin'



// DEFAULT STATE
const default_state = {
	label:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	type: 'button',
	class:undefined,
	style:undefined,
	id:undefined,
	size:undefined,
	has_hollow:false,
	has_dropdown:false,
	meaning:undefined
}

const sizes = ['tiny', 'small', 'large', 'expanded', 'expanded tiny', 'expanded small', 'expanded large']
const meanings = ['secondary', 'success', 'alert', 'warning', 'disabled']



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

	// GET SETTINGS ATTRIBUTES
	const size         = T.isString(settings.size) && sizes.indexOf(settings.size) > -1 ? settings.size : undefined
	const has_hollow   = T.isBoolean(settings.has_hollow)    ? settings.has_hollow  : undefined
	const has_dropdown = T.isBoolean(settings.has_dropdown)  ? settings.has_dropdown  : undefined
	const meaning      = T.isString(settings.meaning) && meanings.indexOf(settings.meaning) > -1 ? settings.meaning : undefined

	settings.class = settings.class ? settings.class + ' button' : 'button'

	if (size)
	{
		settings.class = settings.class ? settings.class + ' ' + size : size
	}
	if (has_hollow)
	{
		settings.class = settings.class ? settings.class + ' hollow' : 'hollow'
	}
	if (has_dropdown)
	{
		settings.class = settings.class ? settings.class + ' dropdown' : 'dropdown'
	}
	if (meaning)
	{
		settings.class = settings.class ? settings.class + ' ' + meaning : meaning
	}

	// BUILD TAG
	button(settings, state, rendering_context, rendering_result)

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
