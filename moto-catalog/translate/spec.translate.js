function labelTranslate(label) {
  return translateLabel.find(item => item.en === label).pl
}

module.exports.spec = (specArray) => {
  return specArray.map(item => {
    return {
      label: labelTranslate(item[0]),
      value: item[1]
    }
  })
};

const translateLabel = [
  { en: 'Make Model', pl: 'Marka/Model' },
  { en: 'Year', pl: 'Rok produkcji' },
  { en: 'Engine', pl: 'Silnik' },
  { en: 'Capacity', pl: 'Pojemność' },
  { en: 'Bore x Stroke', pl: 'Średnica x skok tłoka' },
  { en: 'Compression Ratio', pl: 'Stopień kompresji' },
  { en: 'CoolingSystem', pl: 'System chłodzenia' },
  { en: 'Cooling System', pl: 'System chłodzenia' },
  { en: 'Induction', pl: 'Zasilanie' },
  { en: 'Ignition', pl: 'Zapłon' },
  { en: 'Starting', pl: 'Starter' },
  { en: 'Max Power', pl: 'Moc maksymalna' },
  { en: 'Transmission', pl: 'Skrzynia biegów' },
  { en: 'Primary Drive Ratio', pl: 'Pierwsze przełożenie' },
  { en: 'FinalDrive Ratio', pl: 'Przełożenie główne' },
  { en: 'FinalDrive', pl: 'Przeniesienie napedu' },
  { en: 'Frame', pl: 'Rama' },
  { en: 'Front Suspension', pl: 'Przedni amortyzator' },
  { en: 'Front Wheel Travel', pl: 'Skok przedniego zawieszenia' },
  { en: 'Rear Suspension', pl: 'Tylny amortyzator' },
  { en: 'Rear Wheel Travel', pl: 'Skok tylnego zawieszenia' },
  { en: 'Front Brakes', pl: 'Przednie hamulce' },
  { en: 'Rear Brakes', pl: 'Tylne hamulce' },
  { en: 'Front Tyre', pl: 'Przednie koło' },
  { en: 'Rear Tyre', pl: 'Tylne koło' },
  { en: 'SteeringHead Angle', pl: 'Kąt główki ramy' },
  { en: 'Wheelbase', pl: 'Rozstaw osi' },
  { en: 'Ground Clearance', pl: 'Prześwit' },
  { en: 'Seat Height', pl: 'Wysokość siedzenia' },
  { en: 'Dry Weight', pl: 'Waga na sucho' },

]

module.exports.spec = (specArray) => {
  return specArray.map(item => {
    return {
      label: labelTranslate(item[0]),
      value: item[1]
    }
  })
};
