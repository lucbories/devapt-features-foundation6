
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
	const items_value   = T.isArray(state.items) ? state.items : undefined

	// BUILD DOCK ITEM HEADER
	const item_header_fn = (item_id)=>{
		// const tag_header_resize_img = h('img', {src:'assets/img/fullscreen.png'}, undefined)
		const tag_header_config_img = '#' // ❔' // ❕❓❗
		const tag_header_config_style = {
			'float':'right',
			'font-site':'0.8em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_header_config_props = { style:tag_header_config_style, className:'devapt-dock-button-settings', 'data-devapt-item-id':item_id }
		const tag_header_config = h('button', tag_header_config_props, [ h('span', undefined, [h('span', undefined, [tag_header_config_img])] ) ])
		
		const tag_header_help_img = '?' // ❔' // ❕❓❗
		const tag_header_help_style = {
			'float':'right',
			'font-site':'0.8em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_header_help_props = { style:tag_header_help_style, className:'devapt-dock-button-help', 'data-devapt-item-id':item_id }
		const tag_header_help = h('button', tag_header_help_props, [ h('span', undefined, [h('span', undefined, [tag_header_help_img])] ) ])

		const tag_header_resize_img = '⧉' // ‾
		const tag_header_resize_style = {
			'float':'right',
			'font-site':'0.8em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_header_resize_props = { style:tag_header_resize_style, className:'devapt-dock-button-resize', 'data-devapt-item-id':item_id }
		const tag_header_resize = h('button', tag_header_resize_props, [ h('span', undefined, [h('span', undefined, [tag_header_resize_img])] ) ])
		
		const tag_header_close_img = '×' // html entity "&times;" not x
		const tag_content_close_style = {
			'float':'right',
			'font-site':'1.2em',
			'color':'#8a8a8a',
			'cursor':'pointer',
			'margin-left':'10px',
			'margin-right':'10px'
		}
		const tag_content_close_props = { style:tag_content_close_style, className:'devapt-dock-button-close', 'data-devapt-item-id':item_id }
		const tag_content_close = h('button', tag_content_close_props, [ h('span', undefined, [h('span', undefined, [tag_header_close_img])] ) ])
		
		const tag_header_buttons_children = [tag_content_close,  tag_header_resize, tag_header_help, tag_header_config]
		const tag_header_buttons = h('span', undefined, tag_header_buttons_children)

		const tag_header_id = item_id + '_dock_item_header'
		const tag_header_children = [tag_header_buttons]
		const tag_header_style = {
			'padding-top':'2px',
			'padding-bottom':'2px',
			'margin-top':'2px',
			'margin-bottom':'2px'
		}
		const tag_header_props = { id:tag_header_id, className:'devapt-dock-item-header', style:tag_header_style }
		return h('div', tag_header_props, tag_header_children )
	}

	// BUILD DOCK ITEM CONTENT
	const item_content_fn = (item_name)=>{
		return T.isFunction(rendering_factory) ? rendering_factory(item_name, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : item_desc.toString()
	}

	// BUILD DOCK ITEM
	const cell_fn = (cell) => {
		const cell_id = T.isString(cell.view) ? cell.view : ( (cell && cell.settings && cell.settings.id) ? cell.settings.id : undefined)
		if (! cell_id)
		{
			console.error(context + ':cell_fn:bad dock item id for ', cell)
			return undefined
		}
		const item_style = {
			'border':'2px solid grey',
			'margin-bottom':'2px'
		}
		const tag_props = { id:cell_id + '_dock_item', style:item_style, className:'column column-block devapt-dock-item' }
		return h('div', tag_props, [item_header_fn(cell_id), item_content_fn(cell)])
	}
	
	// BUILD DOCK SPACE
	settings.class = T.isString(settings.class) ? settings.class + ' ' : ''
	settings.class += 'devapt-dock' 
	const tag_dock_children = items_value ? items_value.map(cell_fn) : undefined
	const tag_dock_style = (settings.style ? settings.style: '') + 'border:1px solid #e5e5e5;'
	const tag_dock_props = { id:tag_dock_id, style:tag_dock_style, className:settings.class + ' ' + sizes_class }
	const tag_dock = h('div', tag_dock_props, tag_dock_children )

	rendering_result.add_vtree(tag_dock_id, tag_dock)

	const js_block_grid_dock = `
		window.devapt().on_content_rendered(
			function()
			{
				// console.log('on_content_rendered:button.devapt-dock-button init for %s', "${tag_dock_id}")

				// RESIZE BUTTON
				var resize_button = $("button.devapt-dock-button-resize", "#${tag_dock_id}");
				resize_button.click(
					function(e)
					{
						var id = this['data-devapt-item-id']
						// console.log('resize_button for %s', id, $(e.target))

						if (id)
						{
							window.devapt().ui(id).show()
							window.devapt().ui(id).toggle_from_fullscreen()
						}
					}
				)
				
				// CLOSE BUTTON
				var close_button = $("button.devapt-dock-button-close", "#${tag_dock_id}");
				close_button.click(
					function(e)
					{
						var id = this['data-devapt-item-id']
						// console.log('close_button for %s', id, $(e.target))

						if (id)
						{
							window.devapt().ui(id).toggle()
						}
					}
				)
				
				// HELP BUTTON
				var help_button = $("button.devapt-dock-button-close", "#${tag_dock_id}");
				help_button.click(
					function(e)
					{
						var id = this['data-devapt-item-help']
						if (id)
						{
							window.devapt().ui(id).show()
						}
					}
				)
				
				// SETTINGS BUTTON
				var settings_button = $("button.devapt-dock-button-settings", "#${tag_dock_id}");
				settings_button.click(
					function(e)
					{
						var id = this['data-devapt-item-settings']
						if (id)
						{
							window.devapt().ui(id).show()
						}
					}
				)
			},
			undefined,
			true
		)`
	
	rendering_result.add_body_scripts_tags(
		[
			{
				id:'js-foundation-block-grid-dock-' + tag_dock_id,
				content:js_block_grid_dock
			}
		]
	)
	
	rendering_result.add_head_styles_tags(
		[
			{
				id:'css-foundation-block-grid-dock',
				content:`
div.devapt-dock-item:hover {
	border:'4px solid black;'
}`,
				media:'all'
			}
		]
	)

	return rendering_result
}
