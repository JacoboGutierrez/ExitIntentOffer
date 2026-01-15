<?php
declare(strict_types=1);

namespace Viridian\ExitIntentOffer\Block;

use Magento\Framework\View\Element\Template;
use Magento\Framework\Stdlib\CookieManagerInterface;

class Popup extends Template
{
    private CookieManagerInterface $cookieManager;

    public function __construct(
        Template\Context $context,
        CookieManagerInterface $cookieManager,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->cookieManager = $cookieManager;
    }

    public function isSnoozed(): bool
    {
        return $this->cookieManager->getCookie('viridian_exit_intent_offer_snooze') === '1';
    }
}
