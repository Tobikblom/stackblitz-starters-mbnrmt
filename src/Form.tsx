import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

type FormValues = {
  hasPriceRange: boolean;
  minPrice: string | number;
  maxPrice: string | number;
  recomPrice: string | number;
};

type FormErrors = Partial<FormValues>;

/*
https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/max
If the max attribute is present but is not specified or is invalid, no max value is applied
https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/min
If the input has no default minimum and a value is specified for min that can't be converted to a valid number (or no minimum value is set), the input has no minimum value.
*/

/**
 * Note about checkboxes - they are stupid.
 * When submitting, we should - if not disabled - add it to form data if it is unchecked with a uncheck value of our desire.
 */

export default function Form() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>({
    hasPriceRange: true,
    minPrice: 0,
    maxPrice: 100,
    recomPrice: 50,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // If you use custom inputs, create a custom handler for them, or create a util function that just takes name, and value.
  // e.g.: updateInput(e), updateCustom(name, value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Wrong
    /*
    setValues((values) => ({
      ...values,
      [e.target.name]:
        e.target.type == 'checkbox' ? e.target.checked : e.target.value,
    }));
    */

    // Correct
    flushSync(() => {
      setValues((values) => ({
        ...values,
        [e.target.name]:
          e.target.type == 'checkbox' ? e.target.checked : e.target.value,
      }));
    });

    // Custom validation can be added here...
    /*
    if (e.target.name == 'recomPrice') {
      if (e.target.value.toString() == '0') {
        e.target.setCustomValidity('Cannot be free');
      } else {
        e.target.setCustomValidity('');
      }
    }

    // NOTE: This could be implemented just by adding +/- 10 to the min/max on relevants input after converting them to numbers.
    const formElements = e.target.form.elements;
    const hasPriceRange = formElements.namedItem(
      'hasPriceRange'
    ) as HTMLInputElement;
    const minPrice = formElements.namedItem('minPrice') as HTMLInputElement;
    const maxPrice = formElements.namedItem('maxPrice') as HTMLInputElement;

    if (hasPriceRange.checked) {
      // At least range of 10
      if (Math.abs(minPrice.valueAsNumber - maxPrice.valueAsNumber) < 10) {
        minPrice.setCustomValidity('At least 10 less than max price');
        maxPrice.setCustomValidity('At least 10 greater than min price');
      } else {
        minPrice.setCustomValidity('');
        maxPrice.setCustomValidity('');
      }
    } else {
      minPrice.setCustomValidity('');
      maxPrice.setCustomValidity('');
    }
    */

    validateForm();
  };

  const validateForm = () => {
    if (!formRef.current) return;

    // Custom validation can be added here...
    /*
    const recomPrice = formRef.current.elements.namedItem(
      'recomPrice'
    ) as HTMLInputElement;

    if (recomPrice.value.toString() == '0') {
      recomPrice.setCustomValidity('Cannot be free');
    } else {
      recomPrice.setCustomValidity('');
    }
    */

    if (formRef.current.checkValidity()) {
      setErrors({});
    } else {
      const errors = (
        Array.from(formRef.current.elements) as HTMLInputElement[]
      )
        .filter((element) => !element.validity.valid)
        .reduce(
          (previousError, element) => ({
            ...previousError,
            [element.name]: element.validationMessage,
          }),
          {}
        );

      setErrors(errors);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formData, formJson);
  };

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      <div>
        <input
          id="hasPriceRange"
          type="checkbox"
          name="hasPriceRange"
          aria-errormessage="hasPriceRangeError"
          checked={values.hasPriceRange}
          onChange={handleChange}
        />
        <label htmlFor="hasPriceRange">Has Price Range?</label>
        <span id="hasPriceRangeError">{errors.hasPriceRange}</span>
      </div>

      <div>
        <label htmlFor="minPrice">Min Price</label>
        <input
          id="minPrice"
          type="number"
          name="minPrice"
          aria-errormessage="minPriceError"
          value={values.minPrice}
          onChange={handleChange}
          max={values.hasPriceRange ? values.maxPrice : ''}
          required={values.hasPriceRange}
          disabled={!values.hasPriceRange} // Don't need min price, if no price range
        />
        <span id="minPriceError">{errors.minPrice}</span>
      </div>
      <div>
        <label htmlFor="maxPrice">Max Price</label>
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          aria-errormessage="maxPriceError"
          value={values.maxPrice}
          onChange={handleChange}
          min={values.hasPriceRange ? values.minPrice : ''}
          required={values.hasPriceRange}
          disabled={!values.hasPriceRange} // Don't need max price, if no price range
        />
        <span id="maxPriceError">{errors.maxPrice}</span>
      </div>

      <div>
        <label htmlFor="recomPrice">Recommended Price</label>
        <input
          id="recomPrice"
          type="number"
          name="recomPrice"
          aria-errormessage="recomPriceError"
          value={values.recomPrice}
          onChange={handleChange}
          min={values.hasPriceRange ? values.minPrice : ''}
          max={values.hasPriceRange ? values.maxPrice : ''}
          required={true}
        />
        <span id="recomPriceError">{errors.recomPrice}</span>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
