function calculateMonthlyPayment() {
	function percentageToDecimal(percent) {
		return percent / 12 / 100
	}

	function yearsToMonths(year) {
		return year * 12
	}

	const rate = percentageToDecimal(Number(20))
	const duration = yearsToMonths(Number(5))

	const VAT = 21

	const carValue = 100000
	const downPayment = 25000
	const residualValue = 10000

	let interest_pmt = 0
	let primary_pmt = 0
	let vat_pmt = 0

	const total_price = carValue * (1 + VAT / 100)
	const first_payment = downPayment * (1 + VAT / 100)
	const remaining_price = residualValue * (1 + VAT / 100)

	const princ =
		total_price - first_payment - remaining_price / Math.pow(1 + rate, duration)

	if (princ > 0) {
		interest_pmt = (total_price - first_payment) * rate
		vat_pmt = (total_price - first_payment + interest_pmt) * (VAT / 100)
		primary_pmt =
			princ / ((1 - 1 / Math.pow(1 + rate, duration)) / rate) - interest_pmt
	}

	setMonthlyPayment(primary_pmt.toFixed(2))
}
