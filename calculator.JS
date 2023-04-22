$(document).ready(function () {
	if (!$('html').hasClass('ie7')) {
		$('select').dropdown()
	}
	$('#cc_price, #cc_deposit, #cc_percent, #cc_remaining').on(
		'input',
		function () {
			$(this).val(
				$(this)
					.val()
					.replace(/[^0-9.,]/g, '')
			)
		}
	)
	$('#cc_price').val('')
	$('#cc_type').val('')
	$('#cc_deposit').val(15)
	$('#cc_deposit_type').val('percent')
	$('#cc_remaining').val(15)
	$('#cc_remaining_type').val('percent')
	$('#cc_percent').val(0.99)

	$('input, button').hover(function () {
		$(this).toggleClass('hover')
	})

	$('#cc_type').on('change', changeType)

	$('#submit').on('click', function (e) {
		e.preventDefault()
		calculate()
	})
})
function calculate() {
	// Получаем значения из полей ввода
	const inputs = ['#cc_price', '#cc_percent', '#cc_deposit', '#cc_remaining']
	const [price, percent, deposit, remaining] = inputs.map(input =>
		parseFloat($(input).val().replace(',', '.'))
	)

	// Проверяем корректность ввода
	if (!price || !(percent > 0)) {
		$(inputs[!price ? 0 : 1]).addClass('error')
		return
	}

	// Устанавливаем необходимые константы и переменные
	const VAT = 21
	const isPercent = $('#cc_deposit_type').val() === 'percent'
	const first_payment = isPercent ? 0.01 * price * deposit : deposit
	const amount_left = isPercent ? 0.01 * price * remaining : remaining
	const interest = (percent * 0.01) / 12
	const period = $('#cc_period').val()
	let interest_pmt = 0
	let primary_pmt = 0
	let vat_pmt = 0
	const type = $('#cc_type').val()

	// Вычисляем ежемесячный платеж в зависимости от типа операции
	if (type === 'finance') {
		const princ =
			price - first_payment - amount_left / Math.pow(1 + interest, period)
		const temp = Math.exp(Math.log(1 + interest) * period)
		primary_pmt = princ / ((1 - 1 / temp) / interest)
	} else if (type === 'operative') {
		const price_wo_VAT = (price * 100) / (VAT + 100)
		const first_payment_wo_VAT = (first_payment * 100) / (VAT + 100)
		const amount_left_wo_VAT = (amount_left * 100) / (VAT + 100)
		interest_pmt = (price_wo_VAT - first_payment_wo_VAT) * interest
		const princ =
			price_wo_VAT -
			first_payment_wo_VAT -
			amount_left_wo_VAT / Math.pow(1 + interest, period)
		const temp = Math.exp(Math.log(1 + interest) * period)
		primary_pmt = princ / ((1 - 1 / temp) / interest) - interest_pmt
		vat_pmt = ((primary_pmt + interest_pmt) * VAT) / 100
	}

	// Устанавливаем значение ежемесячного платежа в соответствующее поле
	const monthly_payment = interest_pmt + primary_pmt + vat_pmt
	if (monthly_payment > 0) {
		$('#cc_payment').val(Math.round(monthly_payment * 100) / 100)
	}
}

function changeType() {
	const type = $('#cc_type').val()
	const remaining = type === 'operative' ? 20 : 0
	$('#cc_remaining').val(remaining)
}
$(function () {
	$('#tolltipCallout').hover(() => $('#tooltip').toggle())
})
;(function ($) {
	$.fn.dropdown = function () {
		return this.each(() => {
			const select = $(this),
				container = select.parent().prepend('<ul></ul>'),
				dropdown = $('.dropdown', container),
				selected = $('.selected', dropdown).html(
					$('option:selected', select).html()
				),
				list = $('ul', dropdown)
					.width(dropdown.width())
					.css({ top: dropdown.height() })

			$('.trigger', dropdown).click(e => {
				e.preventDefault()
				list.toggle()
			})

			dropdown.hover(
				() => $(this).addClass('hover'),
				() => {
					$(this).removeClass('hover')
					list.hide()
				}
			)
			$('li', list).hover(
				() => $(this).addClass('hover'),
				() => $(this).removeClass('hover')
			)

			$('li', list).click(function (e) {
				e.preventDefault()
				list.hide()
				selected.html($(this).html())
				$('option', select).prop('selected', false)
				$(`option[value='${$(this).attr('data-value')}]'`, select).prop(
					'selected',
					true
				)
				select.trigger('change')
			})
		})
	}
})(jQuery)
