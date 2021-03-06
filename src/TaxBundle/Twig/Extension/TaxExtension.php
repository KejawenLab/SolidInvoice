<?php

declare(strict_types=1);

/*
 * This file is part of SolidInvoice project.
 *
 * (c) 2013-2017 Pierre du Plessis <info@customscripts.co.za>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace SolidInvoice\TaxBundle\Twig\Extension;

use Doctrine\Common\Persistence\ManagerRegistry;
use SolidInvoice\TaxBundle\Entity\Tax;

class TaxExtension extends \Twig\Extension\AbstractExtension
{
    /**
     * @var ManagerRegistry
     */
    private $registry;

    /**
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return [
            new \Twig\TwigFunction('taxRatesConfigured', [$this, 'taxRatesConfigured']),
        ];
    }

    /**
     * @return true
     */
    public function taxRatesConfigured(): bool
    {
        static $taxConfigured;

        if (null !== $taxConfigured) {
            return $taxConfigured;
        }

        $taxConfigured = $this->registry->getRepository(Tax::class)->taxRatesConfigured();

        return $taxConfigured;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'tax_extension';
    }
}
