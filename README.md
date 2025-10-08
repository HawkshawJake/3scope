# 3Scope ESG Emissions Tracking Platform

A comprehensive full-stack application for tracking and managing Scope 1, 2, and 3 carbon emissions with Climatiq API integration and professional ESG reporting capabilities.

## 🌱 Features

- **Emissions Tracking**: Complete Scope 1, 2, and 3 emissions management
- **Supply Chain Network**: Interactive supplier relationship visualization with D3.js
- **Real-time Calculations**: Climatiq API integration for accurate emission factors
- **Comprehensive Reports**: 22+ ESG report types across 5 categories
- **Professional Dashboard**: Data visualization with Chart.js and Sankey diagrams
- **Authentication**: Secure JWT-based user management with role-based access
- **Geographic Visualization**: World map integration with React-Leaflet
- **Professional Design**: Modern gradient styling with responsive layout
- **Scope-specific Color Coding**: 
  - Scope 1 (Direct): Red
  - Scope 2 (Electricity): Teal
  - Scope 3 (Other Indirect): Blue

## Carbon Emission Scopes

### Scope 1: Direct Emissions
Direct greenhouse gas emissions from sources owned or controlled by your organization:
- Company-owned vehicles and fleet operations
- On-site fuel combustion (heating, cooling)
- Manufacturing and industrial processes
- Fugitive emissions from refrigeration
- Company-owned facilities and equipment

### Scope 2: Electricity Indirect
Indirect emissions from purchased energy consumed by your organization:
- Purchased electricity for offices and facilities
- Purchased steam for heating
- Purchased heating and cooling systems
- Grid electricity for manufacturing
- Renewable energy certificates (RECs)

### Scope 3: Other Indirect
All other indirect emissions in your value chain:
- Business travel and employee commuting
- Supply chain and purchased goods
- Waste disposal and treatment
- Downstream transportation
- Product use and end-of-life treatment

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3scopes-carbon-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Usage

1. **Explore Scope Cards**: Click on each scope card to expand and view detailed examples
2. **Add Emissions**: Use the "Add Emission Source" button to input your organization's data
3. **Monitor Totals**: View real-time calculations of your total carbon footprint
4. **Track Progress**: Review all added emission sources in the summary section

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Inline CSS with modern design principles
- **State Management**: React useState hooks
- **Build Tool**: Vite for fast development and optimized builds

## File Structure

```
src/
├── components/
│   ├── ScopeCard.jsx       # Interactive scope display cards
│   └── EmissionForm.jsx    # Form for adding emission sources
├── App.jsx                 # Main dashboard component
├── App.css                 # Component-specific styles
├── index.css               # Global styles
└── main.jsx               # Application entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (< 768px)

## Future Enhancements

This application is designed for easy backend integration and can be extended with:

- **Data Persistence**: Connect to a database for storing emission data
- **User Authentication**: Multi-user support with organization management
- **Reporting**: Generate PDF reports and charts
- **API Integration**: Connect to carbon factor databases
- **Goal Setting**: Set and track carbon reduction targets
- **Data Import**: CSV/Excel file upload capabilities
- **Analytics**: Historical trends and comparative analysis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite for optimal performance
- Follows GHG Protocol standards for emission scope categorization
- Designed with accessibility and user experience in mind

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
