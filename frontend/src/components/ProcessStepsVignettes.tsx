import { useState, useEffect, useRef } from 'react'
import { vignetteSteps, getTotalSteps, type VignetteStep } from '../config/vignetteSteps'

interface ProcessStepsVignettesProps {
  isVisible: boolean
  currentStep?: number
}

const ProcessStepsVignettes = ({ isVisible, currentStep = 1 }: ProcessStepsVignettesProps) => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation progressive des vignettes quand elles deviennent visibles
  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true)
      vignetteSteps.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSteps(prev => [...prev, index])
        }, index * 200) // Délai de 200ms entre chaque vignette
      })
    }
  }, [isVisible, hasAnimated])

  // Intersection Observer pour l'animation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            vignetteSteps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps(prev => [...prev, index])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  const handleKeyDown = (event: React.KeyboardEvent, step: VignetteStep) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Action optionnelle au clic/activation
      console.log(`Étape ${step.id} activée:`, step.title)
    }
  }

  return (
    <div ref={containerRef} className="mt-12">
      {/* Titre avec indicateur de progression */}
      <div className="text-center mb-8">
        <h3 className="text-gradient text-2xl font-bold mb-3">
          🚀 Votre parcours candidature en {getTotalSteps()} étapes
        </h3>
        <div className="flex justify-center items-center space-x-2">
          {vignetteSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index < currentStep
                  ? 'w-8 bg-gradient-to-r from-emerald-500 to-teal-500'
                  : index === currentStep - 1
                  ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-400'
                  : 'w-2 bg-gray-300'
              }`}
              aria-label={`Progression étape ${index + 1} sur ${getTotalSteps()}`}
            />
          ))}
        </div>
      </div>

      {/* Grille des vignettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vignetteSteps.map((step, index) => (
          <VignetteCard
            key={step.id}
            step={step}
            index={index}
            isVisible={visibleSteps.includes(index)}
            isActive={step.id === currentStep}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    </div>
  )
}

interface VignetteCardProps {
  step: VignetteStep
  index: number
  isVisible: boolean
  isActive: boolean
  onKeyDown: (event: React.KeyboardEvent, step: VignetteStep) => void
}

const VignetteCard = ({ step, index, isVisible, isActive, onKeyDown }: VignetteCardProps) => {
  return (
    <div
      className={`group perspective-1000 transform transition-all duration-700 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'
      }`}
      style={{
        transitionDelay: `${index * 100}ms`
      }}
    >
      <div
        className="relative w-full h-48 cursor-pointer group"
        tabIndex={0}
        role="button"
        aria-label={step.ariaLabel}
        onKeyDown={(e) => onKeyDown(e, step)}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s ease-in-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotateY(180deg)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotateY(0deg)'
        }}
      >
        {/* Face avant */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${step.color.secondary} 
            border-2 border-emerald-200 rounded-2xl p-6 flex flex-col items-center justify-center 
            shadow-lg hover:shadow-emerald-200/50 transition-all duration-300
          `}
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Badge numéro */}
          <div className={`w-12 h-12 bg-gradient-to-br ${step.color.primary} text-white rounded-full 
            flex items-center justify-center font-bold text-lg mb-4 shadow-lg
          `}>
            {step.id}
          </div>

          {/* Titre */}
          <h4 className="text-emerald-800 font-bold text-base text-center mb-2">
            {step.title}
          </h4>

          {/* Barre décorative */}
          <div className={`w-8 h-1 bg-gradient-to-r ${step.color.accent} rounded-full`}></div>
        </div>

        {/* Face arrière */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 
            text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Icône emoji */}
          <div className="text-4xl mb-4">
            {step.icon}
          </div>

          {/* Description */}
          <p className="text-sm text-center leading-relaxed font-medium">
            {step.description}
          </p>

          {/* Badge étape */}
          <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm 
            rounded-full px-3 py-1 text-xs font-semibold">
            {step.id}/{getTotalSteps()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessStepsVignettes
